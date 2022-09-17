const {Command} = require("commander");
const fs = require('fs');
const htmlCreator = require('html-creator');

const program = new Command();


var filePaths = [];                 // keep track of .txt files converted 
var outputPath = './dist'


/**
 * createHtml
 * @param: paraObj
 *          titleObj
 * @return:  
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
 * createHtmlFIles
 * @param: filepath from commandline
 * @returns: void
 */

const createHtmlFiles = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        let htmlTitle = null; 
        let titleObj = new Object({ type: 'title', content: htmlTitle });
        // check for title, regEx checks if a line is followed by 2 newline \n\n\n
        if(data.match(/^.+(\r?\n\r?\n\r?\n)/)) {
          htmlTitle = data.match(/^.+(\r?\n\r?\n\r?\n)/)[0]; 
          titleObj['content'] = htmlTitle.match(/(\w+)/g).join(' ');
        }
    
        const paragraphObj = data
          .substr(htmlTitle ? htmlTitle.length : 0)
          .split(/\r?\n\r?\n/)
          .map(param => {
            return Object({ type: 'p', content: param}); 
          });
    
        const fileToHtml = createHtml(paragraphObj, titleObj);
        const fullFilePath = `${outputPath}/${filePath.match(/([^\/]+$)/g)[0].split('.')[0]}.html`; 
        fs.writeFileSync(fullFilePath, fileToHtml.renderHTML());
    
      });
      filePaths.push(filePath);
}
/**
 * Check if filePath is valid (folder or file .txt), if .txt file => call createHtmlFiles(filePath)
 * @param filePath 
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
      createHtmlFiles(filePath);
    }
  }

  program.version('0.1.2', '-v, --version');
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
      attributes: {href: `${param.match(/([^\/]+$)/g)[0].split('.')[0]}.html`, style: 'display: block'}, 
      content: `${param.match(/([^\/]+$)/g)[0].split('.')[0]}`
    }
  });
  console.log(filePaths)
  indexHtml.document.addElementToType('body', { type: 'div', content: linkObj }) ;
  fs.writeFileSync(`${outputPath}/index.html`, indexHtml.renderHTML());  
} 