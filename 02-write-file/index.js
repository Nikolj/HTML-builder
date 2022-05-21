const fs = require('fs');
const path = require('path');
const rr = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rr.write('Введите текст!\n');

rr.on('line', (text) => {
  if (text.trim() === 'exit') rr.close();

  writableStream.write(`${text}\n`, error => {
    if (error) throw error;
  });
});

rr.on('close', () => {
  process.exit();
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', code => {
  if (code === 0) {
    console.log('Спасибо за проверку!');
  } else {
    console.log(`Oшибка ${code}`);
  }
});