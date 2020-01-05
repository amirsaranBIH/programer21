const fs = require('fs');

function createDirectory(directoryName) {
    fs.mkdir(directoryName, { recursive: true }, err => { if (err) throw err; });
    return directoryName;
}

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function createFile(fileName, data = null) {
    data = data === null ? '<h1>' + fileName + '</h1>' : data;
    fs.writeFile(fileName, data, err => { if (err) throw err; });
    return fileName;
}

function deleteFile(path) {
    fs.unlink(path,  err => { if (err) throw err; });
    return path;
}

module.exports = { createDirectory, readFile, createFile, deleteFile };