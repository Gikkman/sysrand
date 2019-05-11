const {ipcMain} = require('electron')
const path = require('path');
const fs = require('fs');

/************************************************************************
 *  Variables
 ************************************************************************/
let filePath = path.join(global.appRoot, "metadata.json");
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

/************************************************************************
 *  Module exports
 ************************************************************************/
module.exports.updateMetaData = updateMetaData;
module.exports.getMetaData = getMetaData;