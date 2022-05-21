const fs = require('fs');
const path = require('path');
const rr = fs.createReadStream(path.join(__dirname, 'text.txt'));

let content = '';
rr.on('data', chunk => content += chunk);
rr.on('end', () => console.log(content));
rr.on('error', err => console.log('error: ', err.message));