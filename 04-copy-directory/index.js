const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const fromCopy = path.join(__dirname, 'files');
const toCopy = path.join(__dirname, 'files-copy');

fs.access(toCopy, (error) => {
  if (error) {
    fsPromises.mkdir(toCopy);
    console.log('Каталог files-copy создан');
  } else {
    console.log('Каталог files-copy существует');
  }
});

async function copyDir(fromPath, toPath) {
  await fsPromises.rm(toPath, { force: true, recursive: true });
  await fsPromises.mkdir(toPath, { recursive: true });
  const filesNameArr = await fsPromises.readdir(fromPath, { withFileTypes: true });
  for (let item of filesNameArr) {
    const currentItemPath = path.join(fromPath, item.name);
    const copyItemPath = path.join(toPath, item.name);

    if (item.isDirectory()) {
      await fsPromises.mkdir(copyItemPath, { recursive: true });
      await copyDir(currentItemPath, copyItemPath);
    } else if (item.isFile()) {
      await fsPromises.copyFile(currentItemPath, copyItemPath);
    }
  }
}

copyDir(fromCopy, toCopy);
