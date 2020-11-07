
const fs = require('fs');
const path = require('path');

const source = process.argv[2];
const destination = process.argv[3];
const date = process.argv[4];

if (!fs.existsSync(source)) {
  throw new Error("No such source directory found as ''" + source + "''");
}

if (!fs.existsSync(destination)) {
  throw new Error("No such destination directory found as ''" + destination + "''");
}

const logFile = "log.txt";

var dateObj = new Date(date);
var youngestAllowedTime = dateObj.getTime();

if (!youngestAllowedTime) {
  throw new Error("Invalid or missing date, date given was: '" + date + "'" );
}

// Recursively read file paths from source.

var filePaths = [];
readDir(source, filePaths);

// Create directories under destination.

for (var i = 0; i < filePaths.length; i++) {
  var filePath = filePaths[i].split(source)[1];

  filePath = filePath.split(/[\/\\]/);
  filePath.pop();

  var rootPath = destination;
  for (let i = 1; i < filePath.length; i++) {
    var pathFragment = filePath[i];
    var pathName = path.join(rootPath, pathFragment);

    rootPath = pathName;
    if (fs.existsSync(pathName)) {
      continue;
    } else {
      createFolder(pathName);
    }
  }
}

// Copy files to destination folders.

for (var i = 0; i < filePaths.length; i++) {
  let path = filePaths[i];
  var copied = copyFile(path);
  if (copied) {
    saveLog(path);
  }
}

return;

function createFolder(pathName) {
  console.log("Creating folder at " + pathName + " ...");
  fs.mkdirSync(pathName);
}

function copyFile(path) {
  var pathFragment = path.split(source)[1];

  var fileExists = fs.existsSync(destination + pathFragment) // Make sure file doesn't already exist in destination before writing.

  if (!fileExists) {
    console.log("Writing " + destination + pathFragment + " ...");
    fs.copyFileSync(path, destination + pathFragment);
    return true;
  }

  return false;
}

function saveLog(path) {
  fs.appendFileSync(logFile, new Date(Date.now()).toISOString() + " - " + "copied - " + path + "\r\n");
}

function readDir(pathName, files) {
  var directory = fs.readdirSync(pathName);

  for (var i = 0; i < directory.length; i++) {
    var filePath = directory[i];
    var stats = fs.statSync(path.join(pathName, filePath));
    var timestamp = new Date(stats.mtime).getTime();
    if (stats.isDirectory()) {
      readDir(path.join(pathName, filePath), files);
    } else {
      if (timestamp > youngestAllowedTime) {
        continue;
      }
      files.push(path.join(pathName, filePath));
    }
  }
}
