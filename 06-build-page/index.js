const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const createFol = path.join(__dirname, 'project-dist');
const newAssets = path.join(createFol, 'assets');
const newCss = path.join(createFol, 'style.css');
const newHtml = path.join(createFol, 'index.html');
const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const css = path.join(__dirname, 'styles');
const templateHtml = path.join(__dirname, 'template.html');

async function createFolder(inputPath) {
  fs.access(createFol, (error) => {
    if (error) {
      fsPromises.mkdir(inputPath);
    }
  });
}

async function createFile(inputPath, content) {
  return await fsPromises.writeFile(inputPath, content);
}

async function mergeFiles() {
  let arrOfStyles = [];
  const filesNameArr = await fsPromises.readdir(css, { withFileTypes: true });

  for (let item of filesNameArr) {
    const pathToCurrentFile = path.join(css, item.name);
    const fileType = path.extname(pathToCurrentFile);

    if (fileType === '.css') {
      const cssContent = await fsPromises.readFile(pathToCurrentFile, 'utf8');
      arrOfStyles.push(`${cssContent}\n\n`);
    }
  }

  createFile(newCss, arrOfStyles);
}

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

async function pasteComponents() {
  let htmlBase = await fsPromises.readFile(templateHtml, 'utf-8');
  const filesNameArr = await fsPromises.readdir(components, { withFileTypes: true });

  for (let item of filesNameArr) {
    const componentContent = await fsPromises.readFile(path.join(components, `${item.name}`), 'utf-8');
    const regExp = new RegExp(`{{${(item.name).split('.')[0]}}}`, 'g');
    htmlBase = htmlBase.replace(regExp, componentContent);
  }

  createFile(newHtml, htmlBase);
}

async function buildPage() {
  createFolder(createFol);
  mergeFiles();
  copyDir(assets, newAssets);
  pasteComponents();
}

buildPage();