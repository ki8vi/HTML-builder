const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');
const stylesDataArr = new Array();
fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
  .then((files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].isFile() && path.extname(files[i].name) === '.css') {
        fs.readFile(path.join(__dirname, 'styles', files[i].name))
          .then((ch) => {
            stylesDataArr.push(ch);
            fs.writeFile(
              path.join(__dirname, 'project-dist', 'bundle.css'),
              stylesDataArr.join('\n'),
            );
          })
          .catch((err) => process.stdout.write(err.message));
      }
    }
  })
  .catch((err) => process.stdout.write(err.message));
