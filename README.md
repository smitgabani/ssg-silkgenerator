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
- User can **specify a JSON formatted config file** to store options, instead of passing options as command line arguments

**WARNING**: All static assets in the `/assets` folder will be override when converting new `.md` files!

## Installation:
**Clone the repo and then install dependicies and run the scripts or use the command below to install the CLI.**
```
npm install -g ssg-silkgenerator
```
## Usage:
Run one of these commands in your terminal

```
npx ssg-silk -i ./textfiles/file.txt
```

Converting `file.txt` in `./textfiles/` to `html`

```
npx ssg-silk -i ./textfiles
```

Converting all `.txt` files found in `./textfiles` folder

```
npx ssg-silk -i ./textfiles -o ./outputFiles
```

Converting all `.txt` files found in `./textfiles` folder and place `html` output files in `./outputFiles`

Parsing JSON formatted config file with options.
Use of `-c` or `--config` will ignore `-i`, `-o`, `-l` options in the command line.

```json
{
  "input": "./bin/test/samples",
  "output": "./build",
  "stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
  "lang": "en-CA"
}
```

```
npx ssg-silk -c configFile.json
```


## Options:
| flags              | Functions                                          | Requried  |
| ------------------ | -------------------------------------------------- |---------- |
| -v or --version    | Prints the current version                         | n         |
| -h or --help       | Prints a list of options to the screen             | n         |
| -i or --input      | Accepts a path to either a file or folder          | n         |
| -o, --output       | specify a path for .html files output              | n         |

## Examples:

node index.js -i markdownFile.md 
```

Parsing JSON formatted config file with options.

Use of `-c` or `--config` will ignore `-i`, `-o`, `-l` options in the command line. 

```
node index.js -c configFile
```

## License:
MIT License.