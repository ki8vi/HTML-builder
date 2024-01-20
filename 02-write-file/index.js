const process = require('node:process');
const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');
const exit = 'Or type "exit" for quit!\n';

const rl = readline.createInterface(process.stdin, process.stdout);
const streamWrite = fs.createWriteStream(path.join(__dirname, 'file.txt'));

process.stdout.write(`Lets type something here my friend! ${exit}`);
rl.on('line', (content) =>
  content.toLowerCase() !== 'exit' ? enterToConsole(content) : process.exit(),
);

process.on('SIGINT', process.exit);
process.on('exit', () => {
  streamWrite.end();
  process.stdout.write('Good bye my friend!');
});

function enterToConsole(content) {
  streamWrite.write(content + '\n');
}
