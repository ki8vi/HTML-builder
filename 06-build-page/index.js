const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');

createPage();

function createPage() {
  let htmlFile;
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true })
    .then((isExist) => {
      if (!isExist) {
        fs.rm(path.join(__dirname, 'project-dist'), { recursive: true })
          .then(() => {
            return createPage();
          })
          .catch((err) => {
            process.stdout.write(err.message);
          });
      } else {
        createCssFile();
        copyAssetsDir();
        fs.readFile(path.join(__dirname, 'template.html'))
          .then((data) => {
            htmlFile = String(data);
            return fs.readdir(path.join(__dirname, 'components'));
          })
          .then((parts) => {
            return recursiveAddParts(parts, 0, htmlFile);
          })
          .then((htmlFile) => {
            htmlFile = htmlFile.replace(/^[\r\n]{2,}/gm, '');
            return fs.writeFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              htmlFile,
            );
          })
          .catch((err) => {
            process.stdout.write(err.message);
          });
      }
    })
    .catch((err) => {
      process.stdout.write(err.message);
    });
}

function recursiveAddParts(parts, index, htmlFile) {
  if (parts.length > index) {
    const tagName = path.basename(parts[index], path.extname(parts[index]));
    return fs
      .readFile(path.join(__dirname, 'components', parts[index]))
      .then((part) => {
        htmlFile = htmlFile.replaceAll('{{' + tagName + '}}', part);
        return recursiveAddParts(parts, index + 1, htmlFile);
      });
  } else {
    return Promise.resolve(htmlFile);
  }
}

function createCssFile() {
  const stylesDataArr = new Array();
  fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    .then((files) => {
      for (let i = 0; i < files.length; i++) {
        if (files[i].isFile() && path.extname(files[i].name) === '.css') {
          fs.readFile(path.join(__dirname, 'styles', files[i].name))
            .then((ch) => {
              stylesDataArr.push(ch);
              fs.writeFile(
                path.join(__dirname, 'project-dist', 'style.css'),
                stylesDataArr.join('\n'),
              );
            })
            .catch((err) => process.stdout.write(err.message));
        }
      }
    })
    .catch((err) => process.stdout.write(err.message));
}

function copyAssetsDir() {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true })
    .then((isExist) => {
      if (!isExist) {
        fs.rm(path.join(__dirname, 'project-dist', 'assets'), {
          recursive: true,
        })
          .then(() => {
            return copyAssetsDir();
          })
          .catch((err) => {
            process.stdout.write(err.message);
          });
      } else {
        return makeCopy(
          path.join(__dirname, 'assets'),
          path.join(__dirname, 'project-dist', 'assets'),
        );
      }
    })
    .catch((err) => process.stdout.write(err.message));
}

function makeCopy(file, targetFile) {
  fs.readdir(file, { withFileTypes: true })
    .then((files) => {
      let prom = new Array();
      for (let i = 0; i < files.length; i++) {
        if (!files[i].isFile()) {
          prom.push(
            fs
              .mkdir(path.join(targetFile, files[i].name))
              .then(() =>
                makeCopy(
                  path.join(file, files[i].name),
                  path.join(targetFile, files[i].name),
                ),
              ),
          );
        } else {
          prom.push(
            fs.copyFile(
              path.join(file, files[i].name),
              path.join(targetFile, files[i].name),
            ),
          );
        }
      }
      return Promise.all(prom);
    })
    .catch((err) => {
      process.stdout.write(err.message);
    });
}
