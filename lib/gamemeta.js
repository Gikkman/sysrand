const {ipcMain} = require('electron')
const path = require('path');
const fs = require('fs');

let metaData;
function readMetaData() {
    if(metaData) return metaData;

    let filePath = path.join(global.appRoot, "gamemeta.json");
    let data = fs.readFileSync(filePath, {encodig: 'utf8', flag: 'a+'})
    metaData = JSON.parse(data);
    
    return metaData;
}

ipcMain.on('getMetadata', (event) => {
    event.sender.send('metadata', readMetaData());
})