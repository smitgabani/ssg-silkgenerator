const {Command} = require("commander");
const fs = require('fs');
const htmlCreator = require('html-creator');

const program = new Command();


var filePaths = []; //keep track of .txt files converted
var outputPath = './dist'
