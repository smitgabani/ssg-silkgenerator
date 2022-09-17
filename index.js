const { Command } = require('commander');
const program = new Command();
const fs = require('fs');
const htmlCreator = require('html-creator');
var filePaths = []; //keep track of .txt files converted
var outputPath = './dist'
/** 
*  Create htmlCreator object using 2 params
*  @param: paragraphObj, an object of {type, content} for <p>, for .md file paragraphObj is body object containing more than <p>, <a>
*  @return: an object of type htmlCreator, can use htmlRender() to convert to string
*/
const createHtml = (paragraphObj, titleObj) => {
  const html = new htmlCreator().withBoilerplate();
  var bodyContent = [{
    type: 'div',
    attributes: {className: 'paragraphObj'},
    content: paragraphObj
  }]
  // if a title is found, add the title wrapped inside `<h1>`
  // tag to the top of the `<body>` HTML element
  if (titleObj.content) {
    bodyContent.unshift({
      type: 'h1',
      content: titleObj.content,
    });
  }
  if (paragraphObj == null) {
    bodyContent.pop();
  } 
  // Append title to the `<head>` HTML element
  html.document.addElementToType("head", {
    type: "title",
    content: titleObj.content ? `${titleObj.content}` : "Article",
  });
  // Append link to stylesheet to the `<head>` HTML element
  html.document.addElementToType("head", {
    type: "link",
    attributes: {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
    },
  });
  html.document.addElementToType('body', bodyContent);
  return html;
}

/** 
*  Look for title and convert text files into html files
*  @param: filePath from commandLine
*/
const createHtmlFiles = (filePath, fileType) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if(err)
      return console.error(`Unable to read file ${filePath}`, err);
    
    let htmlTitle = null; 
    let titleObj = new Object({ type: 'title', content: htmlTitle });
    //check for title, regEx checks if a line is followed by 2 newline \n\n\n
    if(data.match(/^.+(\r?\n\r?\n\r?\n)/)) {
      htmlTitle = data.match(/^.+(\r?\n\r?\n\r?\n)/)[0]; 
      titleObj['content'] = htmlTitle.match(/(\w+)/g).join(' ');
    }

    const paragraphObj = data
      .substr(htmlTitle ? htmlTitle.length : 0)
      .split(/\r?\n\r?\n/)
      .map(param => {
        if (fileType == "md") {
          return markdownToHtml(param)
        } else {
          return Object({ type: 'p', content: param});
        }
      });

    const fileToHtml = createHtml(paragraphObj, titleObj);
    const fullFilePath = `${outputPath}/${filePath.match(/([^\/]+$)/g)[0].split('.')[0]}.html`; 
    fs.writeFile(fullFilePath, fileToHtml.renderHTML(), (err) => {
      if(err)
        return console.error(`Unable to write file ${fullFilePath} `, err); 
      console.log(`${fullFilePath} is created!`);
    });
  });
  filePaths.push(filePath);
}

const markdownToHtml = (param) => {
  // If Heading 1 to 6, turn into corresponding h1 to h6 tag
  if (param.match(/^\s*#{1,6}[^#]+$/)) {
    const headerNum = param.match(/#/g).length
    return Object({ type: `h${headerNum}`, content: param.replace(/^\s*#{1,6}([^#]+)$/, "$1")});
  }
  else {
    // Wrap bold text inside <b></b>
    param = param.replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>")
    param = param.replace(/__([^\*]+)__/g, "<b>$1</b>")

    // Wrap italic text inside <i></i>
    param = param.replace(/\*([^\*]+)\*/g, "<i>$1</i>")
    param = param.replace(/_([^\*]+)_/g, "<i>$1</i>")

    // Turn link: [Title](http://example.com) into: <a href="http://example.com">Title</a>
    param = param.replace(/\[(.+)\]\((.+)\)/, '<a href="$2">$1</a>')

    if(param.match(/\[(.+)\]\((.+)\)/))
      return Object({type: 'a', attributes: {href: param.match(/\[(.+)\]\((.+)\)/)[2]}, content: param.match(/\[(.+)\]\((.+)\)/)[1]}); 
    if(param.match(/---/))
      return Object({type: 'hr', content: null});
    return Object({ type: 'p', content: param});
  }
}

/**
*  Check if filePath is valid (folder or file .txt), if .txt file => call createHtmlFiles(filePath)
*  @param: filePath from commandLine
*  @param: isCheckPath, boolean for checking if the function is for checking output path
*/
const readInput = (filePath) => {
  const stat = fs.lstatSync(filePath); 
  if(!stat.isFile() && stat.isDirectory()) {
    fs.readdirSync(filePath).forEach((file) => {
        //recursive until a .txt file is recognized
        readInput(`${filePath}/${file}`);
    })
  }
  else if(stat.isFile() && filePath.split('.').pop() == "txt") {
    createHtmlFiles(filePath, "txt");
  }
  else if (stat.isFile() && filePath.split(".").pop() == "md") {
    createHtmlFiles(filePath, "md");
  }
}

//configure program
program.version('tue-1st-ssg 0.1', '-v, --version');
program 
  .option('-o, --output <path>', 'specify a path for .html files output')
  .requiredOption('-i, --input <file path>', '(required) transform .txt or .md files into .html files');

program.parse(process.argv)

//Look for option
const option = program.opts();
if(option.output) {
  let tempPath = fs.statSync(option.output); 
  if(tempPath.isDirectory())
    outputPath = option.output
}

if(option.input) {
  if (!fs.existsSync(outputPath)) 
    fs.mkdirSync(outputPath);
  readInput(option.input);
  //delete previous html files in the output folder after generating new html files
  fs.readdirSync(outputPath).forEach(file => {
    const outputFolderFile = `${outputPath}/${file}`
    if(filePaths.indexOf(outputFolderFile) < 0 && outputFolderFile.split('.').pop() == "html") {
      fs.unlink(outputFolderFile, (err) => {
        if(err) console.log(err);
      })
    }
  });
  //creating index.html linking all html files
  const indexHtml = createHtml(null, {type: 'title', content: 'Index'});
  const linkObj = filePaths.map(param => {
    return {
      type: 'a', 
      //replace white space with %20
      attributes: {href: `${param.match(/([^\/]+$)/g)[0].split('.')[0].replace(/\s/g, '%20')}.html`, style: 'display: block'}, 
      content: `${param.match(/([^\/]+$)/g)[0].split('.')[0]}`
    }
  });
  indexHtml.document.addElementToType('body', { type: 'div', content: linkObj }) ;
  fs.writeFile(`${outputPath}/index.html`, indexHtml.renderHTML(), (err) => {
    if(err)
      return console.error(`Unable to write files ${outputPath} `, err); 
    console.log(`${outputPath}/index.html is created`);
  });  
} 
