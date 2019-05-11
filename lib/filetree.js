const {dialog, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

const gameMetaData = require('./gamemeta');
const hashing = require('./hashing');
const server = require("./server");

/************************************************************************
 *  HTTP bindings
 ************************************************************************/
server.bindGet("/scan/:dir", (req, res) => {
    let dir = req.params.dir;
    console.log("Received request to scan flat " + dir)
    res.send(scanFlat(dir));
});

server.bindGet("/scanall/:dir", (req, res) => {
    let dir = req.params.dir;
    console.log("Received request to scan " + dir)
    res.send(scan(dir));
});

/************************************************************************
 *  Internal methods
 ************************************************************************/
function scan (dir) {
    let filelist = {
        type: "dir",
        children: []
    };

    return scanRecursive(dir, filelist.children);
}

function scanRecursive(dirPath, filelist) {
    const files = fs.readdirSync(dirPath);
    for (const node of files) {
        const absolutePath = path.join(dirPath, node);
        const fileMetaData = fs.statSync(absolutePath);
        
        if (fileMetaData.isDirectory()) {
            var dir = {
                path: dirPath,
                type: "dir",
                text: node,
                children: []
            }
            scanRecursive(absolutePath, dir.children);
            filelist.push(dir);
        } 
        else {
            var file = {
                hash: hashing.md5FileSync(absolutePath),
                path: dirPath,
                file: node,
                type: "file",
                text: node
            };
            gameMetaData.updateMetaData(file.hash, file);
            filelist.push(file);
        }
    }
    return filelist;
}

function scanFlat(dirPath) {
    const files = fs.readdirSync(dirPath);
    const filelist = [];
    for (const node of files) {
        const absolutePath = path.join(dirPath, node);
        const fileMetaData = fs.statSync(absolutePath);
        
        if (fileMetaData.isDirectory()) {
            var dir = {
                path: path.join(dirPath, node),
                type: "dir",
                text: node,
                children: true
            }
            filelist.push(dir);
        } 
        else {
            var file = {
                hash: hashing.md5FileSync(absolutePath),
                path: dirPath,
                file: node,
                type: "file",
                text: node
            };
            let metadata = gameMetaData.getMetaData(file.hash);

            filelist.push(merge(file,metadata));
        }
    }
    return filelist;
}

function merge(origin, extensions) {
    Object.keys(extensions).forEach(function(key) { origin[key] = extensions[key]; });
    return origin;
}

/************************************************************************
 *  Events
 ************************************************************************/
ipcMain.on('openDir', (event) => {  
    dialog.showOpenDialog(win, {properties: ['openDirectory']} ,function (fileNames) { 
        // fileNames is an array that contains all the selected 
        if(fileNames === undefined) { 
            console.log("No file selected"); 
        } else { 
            console.log("Chosen directory: " + fileNames[0]); 
            event.sender.send('openDir-res', fileNames[0]); 
        }
    });
});