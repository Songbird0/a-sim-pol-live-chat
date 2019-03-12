const fs = require("fs");
const path = require("path");
const Q = require("q");

const COMMON_DIRECTORY_PATH = path.resolve(process.cwd(), "commons");
const CSS_DIRECTORY_PATH = path.resolve(COMMON_DIRECTORY_PATH, "css");
const IMAGE_DIRECTORY_PATH = path.resolve(COMMON_DIRECTORY_PATH, "images");

let commonDirectory = Q.defer();
let cssDirectory = Q.defer();
let imageDirectory = Q.defer();

fs.mkdir(COMMON_DIRECTORY_PATH, { recursive: false }, (err) => {
  if (err) { throw err; }
  commonDirectory.resolve(`'${COMMON_DIRECTORY_PATH}' was created!`);
});
fs.mkdir(CSS_DIRECTORY_PATH, { recursive: false }, (err) => {
  if (err) { throw err; }
  cssDirectory.resolve(`'${CSS_DIRECTORY_PATH}' was created!`);
});
fs.mkdir(IMAGE_DIRECTORY_PATH, { recursive: false }, (err) => {
  if (err) { throw err; }
  imageDirectory.resolve(`'${IMAGE_DIRECTORY_PATH}' was created!`);
});

commonDirectory.promise.then((confirmation) => {
  console.log(confirmation);
  return cssDirectory.promise;
})
.then((confirmation) => {
  console.log(confirmation);
  return imageDirectory.promise;
})
.then(console.log)
.done();
