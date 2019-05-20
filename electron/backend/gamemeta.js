const {ipcMain} = require('electron')
const path = require('path');
const fs = require('fs');
const {app} = require('electron');

/************************************************************************
 *  Variables
 ************************************************************************/
let appRoot = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : path.resolve('./');
let filePath = path.join(appRoot, "metadata.json");
let metaData;

/************************************************************************
 *  Interal methods
 ************************************************************************/
function allMetaData() {
    if(metaData) return metaData;

    let data = fs.readFileSync(filePath, {encodig: 'utf8', flag: 'a+'})
    
    if(data.lenth) {
        console.log("Meta data file existed")
        metaData = JSON.parse(data);
    } else {
        console.log("Meta data file didn't exist. Creating a new one")
        metaData = {};   
    }    
    return metaData;
}

function getMetaData(id) {
    return metaData[id];
}

function updateMetaData(id, data) {
    metaData[id] = data;
    fs.writeFile(filePath, JSON.stringify(metaData), (err) => {
        if(err) {
            console.log("Error when writing meta data file:");
            console.log(err);
        }
    });
}

/************************************************************************
 *  Events
 ************************************************************************/
ipcMain.on('getAllMetadata', (event) => {
    event.sender.send('getAllMetadata-res', allMetaData());
})

ipcMain.on('updateMetaData', (event, id, data) => {
    console.log("Updating meta data for " + id);
    updateMetaData(id, data);
})

ipcMain.on('paths', (event) => {
    let paths = {
        execpath: process.execPath,
        resolve: path.resolve("./"),
        dirname:  path.resolve(__dirname),
        apppath: app.getAppPath('exe'),
        portdir: process.env.PORTABLE_EXECUTABLE_DIR,
        appname: process.env.PORTABLE_EXECUTABLE_APP_FILENAME
    }
    event.sender.send('paths-res', paths);
});

/************************************************************************
 *  Module exports
 ************************************************************************/
module.exports.updateMetaData = updateMetaData;
module.exports.getMetaData = getMetaData;