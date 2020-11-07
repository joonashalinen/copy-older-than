
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

var copyFileList = [];

// Recursively read file paths from source.

var filePaths = [];
readDir(source, filePaths);

// Stage copy file list.

for (var i = 0; i < filePaths.length; i++) {
  let path = filePaths[i];
  copyFile(path);
}

// Ask for user confirmation

askForConfirmation();

function askForConfirmation() {
  rl.question('Please check the list of files to be written (or overwritten) above. Do you want to continue? [Y][N]', (answer) => {
    if (answer.toLowerCase().includes("y")) {
      rl.close();
      createDirectories(); // Create directories under destination.
      commitCopyingFiles(); // Copy files
      console.log("Done"); // Finished
      return;
    } else if (answer.toLowerCase().includes("n")) {
      process.exit(1);
    }
    askForConfirmation();
  });
}

function commitCopyingFiles() {

  for (var i = 0; i < copyFileList.length; i++) {
    var copyFileFunc = copyFileList[i];
    copyFileFunc();
  }

}

function createDirectories() {

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
}

function createFolder(pathName) {
  console.log("Creating folder at " + pathName + " ...");
  fs.mkdirSync(pathName);
}

function copyFile(path) {
  var pathFragment = path.split(source)[1];

  var fileExists = fs.existsSync(destination + pathFragment) // Make sure file doesn't already exist in destination before writing.

  if (!fileExists) {
    console.log("Ready to write to " + destination + pathFragment + " ...");
    copyFileList.push(() => {
      console.log("Writing " + destination + pathFragment + " ...");
      fs.copyFileSync(path, destination + pathFragment);
      saveLog(path);
    });

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
