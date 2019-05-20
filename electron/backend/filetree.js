const {dialog, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const util = require('util');

const gameMetadata = require('./repositories/gameMetadata');
const hashing = require('./hashing');
const server = require("./server");

const stat = util.promisify(fs.stat);
const md5 = util.promisify(hashing.md5File);

/************************************************************************
 *  HTTP bindings
 ************************************************************************/
server.bindGet("/scan/:dir", async (req, res) => {
    let dir = req.params.dir;
    console.log("Received request to scan flat " + dir)
    res.send( await scanFlat(dir));
});

/************************************************************************
 *  Internal methods
 ************************************************************************/

async function scanFlat(dirPath) {
    const files = fs.readdirSync(dirPath);
    const filelistPromises = [];
    for (const nodeName of files) {
        filelistPromises.push(processNode(dirPath, nodeName));
    }
    let filelist = await Promise.all(filelistPromises);
    filelist.sort((e1, e2) => {
        if(e1.type === "dir" && e2.type !== 'dir')
            return -1;
        if(e1.type !== 'dir' && e2.type === 'dir')
            return 1;
        if(e1.text < e2.text) return -1;
        if(e1.text > e2.text) return 1;
        return 0;
    });
    return filelist;
}

async function processNode(dirPath, nodeName) {
    const absolutePath = path.join(dirPath, nodeName);
    const nodeStat = await stat(absolutePath);
    let output;
    if (nodeStat.isDirectory()) {
        output = {
            path: path.join(dirPath, nodeName), // Path to this directory
            type: "dir",        // Decides icons and such in JSTree
            text: nodeName,     // The text that JSTree renders on the node
            children: true      // Makes this node expandable in JSTree
        }
    } 
    else {
        let fileHash = await md5(absolutePath)
        let metadata = await gameMetadata.get(fileHash);
        if(!metadata) {
            metadata = {
                fileHash: fileHash,
                title: figureOutTitle(nodeName),
                completed: 0,
            }
            gameMetadata.save(metadata);
        }
        output = {
            fileHash: metadata.fileHash,    // File hash of this game
            title: metadata.title,          // Title of the game
            completed: metadata.completed,  // Is the game completed
            path: dirPath,       // Path to this file
            file: nodeName,      // File name
            type: "file",        // Decides icons and such in JSTree
            text: metadata.title // The text that JSTree renders on the node
        };
    }
    return output;
}

function figureOutTitle(nodeName) {
    let lowest = ['.','(','[']
        .map(char => nodeName.indexOf(char))
        .filter(index => index > 0)
        .reduce((min, curr) => curr < min ? curr : min, nodeName.length);
    return nodeName.substr(0, lowest).trim();
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