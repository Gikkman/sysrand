const {ipcMain} = require('electron')
const server = require("./server");
const path = require('path');
const fs = require('fs');

/************************************************************************
 *  Variables
 ************************************************************************/
let currentPath;
let currentFile;
let stateDir = ensureStateDir();

/************************************************************************
 *  Internal methods
 ************************************************************************/
function loadGame(path, file) {
    if(path === currentPath && file === currentFile) {
        return;
    } else {
        console.log("Loading game: " + path + "\\" + file);
    }
    server.push("PAUS");
    saveStateIfRunning(currentFile);
    server.push("GAME", path + "\\" + file);
    loadStateIfExists(file);
    server.push("CONT");

    currentPath = path;
    currentFile = file;
}

function saveStateIfRunning(file) {
    if(file) {
        server.push("SAVE", saveStatePath(file));
    } else {
        console.log("No game currently loaded. Skipping pausing and saving");
    }
}

function loadStateIfExists(file) {
    if(fs.existsSync(saveStatePath(file))) {
        server.push("LOAD", saveStatePath(file));
    } else {
        console.log("No save state existed. Skipping loading");
    }
}

function saveStatePath(file) {
    return stateDir + "\\" + file + ".State";
}

function ensureStateDir() {
    let stateDir = path.join(global.appRoot, "states");
    try {
        fs.mkdirSync(stateDir, { recursive: true });
        console.log("New save state directory created: " + stateDir);
        return stateDir;
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
        console.log("Save state directory already existed: " + stateDir);
        return stateDir;
    }
}

/************************************************************************
 *  Events
 ************************************************************************/
ipcMain.on('loadGame', (event, path, game) => {
    loadGame(path, game);
})