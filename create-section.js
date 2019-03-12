const fs = require("fs");
const path = require("path");
const Q = require("q");

const VIEW_DIR = path.resolve(process.cwd(), "views");

const sectionName = process.argv[2];

if (!(sectionName && sectionName.length > 0)) {
  throw new Error("`sectionName` cannot be undefined/null or empty.");
}

const newSectionPath = path.resolve(VIEW_DIR, sectionName);

let sectionDirectoryCreation = Q.defer();

let outDirectoryResources = {
  "outDirectoryPath": path.resolve(newSectionPath, "out"),
  "outDirectory": Q.defer()
};

let entryFileResources = {
  "entryFilePath": path.resolve(newSectionPath, "entry.js"),
  "entryFile": Q.defer()
};

fs.mkdir(newSectionPath, {
  recursive: true
}, (err) => {
  if (err) {
    throw err;
  }
  sectionDirectoryCreation.resolve(`'${newSectionPath}' was created!`);
});

fs.mkdir(outDirectoryResources.outDirectoryPath, {
  recursive: true
}, (err) => {
  if (err) {
    throw err;
  }
  outDirectoryResources.outDirectory.resolve(`'${outDirectoryResources.outDirectoryPath}' was created!`);
});

const initialCode = `throw "unimplemented!";`;

fs.writeFile(entryFileResources.entryFilePath, initialCode, (err) => {
  if (err) {
    throw err;
  }
  entryFileResources.entryFile.resolve(`'${entryFileResources.entryFilePath}' was created!`);
});

sectionDirectoryCreation.promise.then((confirmation) => {
    console.log(confirmation);
    return outDirectoryResources.outDirectory.promise;
  })
  .then((confirmation) => {
    console.log(confirmation);
    return entryFileResources.entryFile.promise;
  })
  .then(console.log)
  .done();
