const fsPromises = require('fs/promises');
const path = require('path');
const toFile = path.join(__dirname, 'project-dist', 'bundle.css');
const fromFolder = path.join(__dirname, 'styles');
let arrOfStyles = [];
(async () => {
  const filesName = await fsPromises.readdir(fromFolder, { withFileTypes: true });

  for (let it of filesName) {
    const toCurrFile = path.join(fromFolder, it.name);
    const type = path.extname(toCurrFile);

    if (type === '.css') {
      const content = await fsPromises.readFile(toCurrFile, 'utf8');
      arrOfStyles.push(`${content}\n`);
    }
  }

  await fsPromises.writeFile(toFile, arrOfStyles);
})();