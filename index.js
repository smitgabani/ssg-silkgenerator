const { Command } = require('commander');
const program = new Command();
const fs = require('fs');
const htmlCreator = require('html-creator');
// var filePaths = []; //keep track of .txt files converted
// var outputPath = './dist';
// var lang = "en-CA";
const path = require('path');
const { SSG } = require('./ssg.js');

// /** 
// *  Create htmlCreator object using 2 params
// *  @param: bodyObj, an object of {type, content} for <p>, for .md file bodyObj is body object containing more than <p>, <a>
// *  @return: an object of type htmlCreator, can use htmlRender() to convert to string
// */
// const createHtml = (bodyObj, titleObj) => {
//   const html = new htmlCreator().withBoilerplate();
//   if(bodyObj[0].type == 'h1') {
//     bodyObj.shift();
//   }
//   var bodyContent = [{
//     type: 'div',
//     attributes: {className: 'bodyObj'},
//     content: bodyObj
//   }]
//   // if a title is found, add the title wrapped inside `<h1>`
//   // tag to the top of the `<body>` HTML element
//   if (titleObj.content) {
//     bodyContent.unshift({
//       type: 'h1',
//       content: titleObj.content,
//     });
//   }
//   if (bodyObj == null) 
//     bodyContent.pop();
  
//   html.document.setTitle(titleObj.content ? `${titleObj.content}` : "Article")
//   // Append link to stylesheet to the `<head>` HTML element
//   html.document.addElementToType("head", {
//     type: "link",
//     attributes: {
//       rel: "stylesheet",
//       href: "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
//     },
//   });
//   html.document.addElementToType('body', bodyContent);
//   return html;
// }
// /**
//  * 
//  * @param {*} fullOutPutPath the output path + filename + file extension 
//  * @param {*} fileToHtmlCreator the htmlCreator object created from the input file
//  */
// const writeHTMLFiles = (fullOutPutPath, fileToHtmlCreator) => {
//   fs.writeFile(fullOutPutPath, fileToHtmlCreator.renderHTML()
//   .replace(/<html>/, `<html lang="${lang}">`), (err) => {
//   if(err) 
//     return console.error('\x1B[31m', `Unable to create file ${fullOutPutPath}`, '\x1B[0m');
//   else 
//     console.log('\x1b[36m', `${fullOutPutPath} is created`, '\x1b[0m');
//   });
// } 
// /** 
// *  Look for title and convert text files into html files
// *  @param: filePath from commandLine
// */
// const createHtmlFiles = (filePath, fileType) => {
  
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if(err)
//       return console.error(`Unable to read file ${filePath}`, err);
//     let titleObj = new Object({ type: 'title', content: null });


//     //check for title, regEx checks if a line is followed by 2 newline \n\n\n
//     if(data.match(/^.+(\r?\n\r?\n\r?\n)/)) {
//       titleObj.content = data.match(/^.+(\r?\n\r?\n\r?\n)/)[0].match(/(\w+)/g).join(' ');
//     }
//     let count = 0; 
//     const bodyObj = data
//       .substr(titleObj.content ? titleObj.content.length : 0)
//       .split(/\r?\n\r?\n/)
//       .map(param => {
//         if (fileType == ".md") {
//           if (param.match(/^\s*#{1,6}[^#]+$/) && count == 0) {
//             titleObj.content = param.replace(/^\s*#{1,6}([^#]+)$/, "$1").trim();
//             count++;
//           }
//           return markdownToHtml(param);
//         } else {
//           return Object({ type: 'p', content: param});
//         }
//       });

//     const fileToHtmlCreator = createHtml(bodyObj, titleObj);
//     const fullOutPutPath = path.join(outputPath, `${path.basename(filePath, fileType)}.html`);
//     //since html creator doesn't support adding attribute to <html>, adding `lang` here seems weird
//     writeHTMLFiles(fullOutPutPath, fileToHtmlCreator);
//   });
//   filePaths.push(path.basename(filePath));
// }

// const markdownToHtml = (param) => {
//   // If Heading 1 to 6, turn into corresponding h1 to h6 tag
//   if (param.match(/^\s*#{1,6}[^#]+$/)) {
//     const headerNum = param.match(/#/g).length;
//     return Object({ type: `h${headerNum}`, content: param.replace(/^\s*#{1,6}([^#]+)$/, "$1")});
//   }
//   else {
//     // Wrap bold text inside <b></b>
//     param = param.replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>")
//     param = param.replace(/__([^\*]+)__/g, "<b>$1</b>")

//     // Wrap italic text inside <i></i>
//     param = param.replace(/\*([^\*]+)\*/g, "<i>$1</i>")
//     param = param.replace(/_([^\*]+)_/g, "<i>$1</i>")
//     //Wrap code inside <code>
//     param = param.replace(/\`([^\`].+?)\`/g, "<code>$1</code>");
//     param = param.replace(/(```([^`].+?)```)/gms, "<code>$2</code>")
    
//     // Turn link: [Title](http://example.com) into: <a href="http://example.com">Title</a>
//     param = param.replace(/\[(.+)\]\((.+)\)/, '<a href="$2">$1</a>')

//     if(param.match(/\[(.+)\]\((.+)\)/))
//       return Object({type: 'a', attributes: {href: param.match(/\[(.+)\]\((.+)\)/)[2]}, content: param.match(/\[(.+)\]\((.+)\)/)[1]}); 
//     if(param.match(/---/))
//       return Object({type: 'hr', content: null});
//     return Object({ type: 'p', content: param});
//   }
// }

// /**
// *  Check if filePath is valid (folder or file .txt), if .txt file => call createHtmlFiles(filePath)
// *  @param: filePath from commandLine
// *  @param: isCheckPath, boolean for checking if the function is for checking output path
// */
// const readInput = async (filePath) => {
//   const stat = fs.lstatSync(filePath);
//   if(!stat.isFile() && stat.isDirectory()) {
//     fs.readdirSync(filePath).forEach((inDirectory) => {
//         //recursive until a .txt or .md file is recognized
//         readInput(path.join(filePath, inDirectory));
//     })
//   }
//   else if(stat.isFile() && path.extname(filePath) == ".txt") {
//     createHtmlFiles(filePath, ".txt");
//   }
//   else if (stat.isFile() && path.extname(filePath) == ".md") {
//     createHtmlFiles(filePath, ".md");
//   }
// }

// /**
// *  Process input <filepath>
// *  @param: input filePath from commandLine
// */
// const processInput = async (filepath) =>{
//   if (!fs.existsSync(outputPath)) 
//     fs.mkdirSync(outputPath);
//   //delete previous html files in the output folder after generating new html files
//   fs.readdirSync(outputPath).forEach(file => {
//     const outputFolderFile = `${outputPath}/${file}`;
//     fs.unlink(outputFolderFile, (err) => {
//       if(err) 
//         console.error('\x1B[31m', `Cant delete file ${outputFolderFile} ${err}`, '\x1B[31m');
//     })
//   });
//   //readInput and write all files
//   readInput(filepath);
//   //creating index.html linking all html files
//   const linkObj = filePaths.map(param => {
//     return {
//       type: 'a', 
//       //replace white space with %20
//       attributes: {href: `${param.match(/([^\/]+$)/g)[0].split('.')[0].replace(/\s/g, '%20')}.html`, style: 'display: block'}, 
//       content: `${param.match(/([^\/]+$)/g)[0].split('.')[0]}`
//     }
//   });
//   const indexHtmlCreator = createHtml(linkObj, {type: 'title', content: 'Index'});
//   const indexOutputPath = path.join(outputPath, 'index.html');
//   writeHTMLFiles(indexOutputPath, indexHtmlCreator);
// }

//configure program
program.version('tue-1st-ssg 0.1', '-v, --version');
program 
  .option('-o, --output <path>', 'specify a path for .html files output')
  .option('-l, --lang <language code>', 'adding a language to HTML document')
  .option('-i, --input <file path>', '(required) transform .txt or .md files into .html files')
  .option('-c, --config <config file path>', 'use stored commands in config file');

program.parse(process.argv)

//Look for option
const option = program.opts();

if(option.config){
  try {
    let configData = fs.readFileSync(option.config);
    let configOptions = JSON.parse(configData); 
    for(const [key, value] of Object.entries(configOptions)) {
      value || value.length > 0 ? option[`${key}`] = `${value}` : option[`${key}`] = undefined;
    }
    if(!option.input) {
      console.error('\x1B[31m', `error: input <file or directory> is not specified in config file ${option.config}`, '\x1B[0m');
      process.exit(-1);
    }
  } catch(error) {
  console.error('\x1B[31m', `Can't read or parse config file ${option.config}\n ${error}`, '\x1B[0m');
  process.exit(-1);
  }
}
if(option.output) {
  outputPath = option.output
}
if(option.lang) {
  lang = option.lang;
}
if(option.input) {
  var ssg = new SSG(option.input, outputPath, lang);
  ssg.processInput(option.input);
}
else
  console.error('\x1B[31m', `error: required option '-i, --input <file path>' not specified`, '\x1B[0m');