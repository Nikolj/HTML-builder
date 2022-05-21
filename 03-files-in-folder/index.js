const fsPromises = require('fs/promises');
const path = require('path');

(async () => {
  const fileName = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });

  for (let it of fileName) {
    if (it.isFile()) {
      const fullName = it.name;
      const fileName = fullName.split('.')[0];
      const pathFile = path.join(__dirname, 'secret-folder', fullName);
      const typ = path.extname(pathFile).substring(1);
      const status = await fsPromises.stat(pathFile);
      console.log(`${fileName} - ${typ} - ${status.size}b`);
    }
  }
})();