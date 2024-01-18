const fs = require('node:fs/promises');
const path = require('node:path');

copyDir();
function copyDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
    .then((isExist) => {
      if (!isExist) {
        fs.rm(path.join(__dirname, 'files-copy'), { recursive: true })
          .then(() => {
            copyDir();
          })
          .catch((err) => {
            process.stdout.write(err.message);
          });
      } else {
        fs.readdir(path.join(__dirname, 'files'))
          .then((files) => {
            for (let i = 0; i < files.length; i++) {
              fs.copyFile(
                path.join(__dirname, 'files', files[i]),
                path.join(__dirname, 'files-copy', files[i]),
              ).catch((err) => process.stdout.write(err.message));
            }
          })
          .catch((err) => process.stdout.write(err.message));
      }
    })
    .catch((err) => process.stdout.write(err.message));
}
