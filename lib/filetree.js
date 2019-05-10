const {dialog, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

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
    for (const file of files) {
        const absolutePath = path.join(dirPath, file);
        const fileMetaData = fs.statSync(absolutePath);
        
        if (fileMetaData.isDirectory()) {
            var dir = {
                path: dirPath,
                type: "dir",
                text: file,
                children: []
            }
            scanRecursive(absolutePath, dir.children);
            filelist.push(dir);
        } 
        else {
            filelist.push({
                path: dirPath,
                file: file,
                type: "file",
                text: file
            });
        }
    }
    return filelist;
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
            let data = scan(fileNames[0]);
            event.sender.send('fileData', data) 
        } 
    
    });
});