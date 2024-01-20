const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');

fs.readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
})
  .then((files) => {
    const arrOfFiles = Array.from(files);
    for (let i = 0; i < arrOfFiles.length; i++) {
      if (arrOfFiles[i].isFile()) {
        const extention = path.extname(arrOfFiles[i].name).slice(1);
        const base = path.basename(arrOfFiles[i].name, extention).slice(0, -1);
        fs.stat(path.join(__dirname, 'secret-folder', arrOfFiles[i].name))
          .then((res) => {
            const size = res.size;
            const outputStr = `${base} - ${extention} - ${size}b`;
            process.stdout.write(outputStr + '\n');
          })
          .catch((err) => {
            process.stdout.write(err.message);
          });
      }
    }
  })
  .catch((err) => {
    process.stdout.write(err.message);
  });
