# Silkgenerator (static site generator)

A Javascript command line program ***ssg-silkgenerator*** that converts **.txt** and **.md** files into **.html** files. In short a basic command line static site generator.

## Implemented features. 
- Automatically parse titles from .txt files => .html files to have `<h1>` and `<title>` tags
- All generated HTML files will be placed into a `./dist` folder.
- All generated HTML files comes with [Water.css](https://github.com/kognise/water.css) by default.
- The user can specify the location for the CSS stylesheet.
- The program has an optional input JSON file. The program will extract the `input`, `stylesheet` and `lang` properties and ignore other options from the JSON file to generate HTML files accordingly.
- The program accepts a file name or dir name as input.If `input path` is a dir, it will look for all `.txt` and `.md` files in the folder and in subfolder(s)
- An `Index.html` contains links to other `.html` files created in folder.
- Support static assets: All generated HTML files (from markdown files only) will reference static assets (images or favicon) from the `/assets` folder.

**WARNING**: All static assets in the `/assets` folder will be override when converting new `.md` files!

## Usage:

## Options:

## Examples:

## License:
MIT License.