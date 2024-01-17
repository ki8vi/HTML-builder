const fs = require('fs');
const path = require('node:path');
const process = require('process');
const targetFilePath = path.join(__dirname, 'text.txt');
const streamRead = fs.createReadStream(targetFilePath, 'utf8');

streamRead.on('data', (content) => {
  process.stdout.write(content + '\n');
});

streamRead.on('error', (error) => {
  process.stdout.write(error.message + '\n');
});
