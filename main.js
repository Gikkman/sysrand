const {app, BrowserWindow, ipcMain} = require('electron')
const url = require('url')
const path = require('path')

const server = require('./lib/server')();

let win

function createWindow() { 
  server.init();

   win = new BrowserWindow({width: 800, height: 600, 
    webPreferences: {
      nodeIntegration: true
    }
  }) 
   win.loadURL(url.format ({ 
      pathname: path.join(__dirname, 'index.html'), 
      protocol: 'file:', 
      slashes: true
   }))
   win.webContents.openDevTools()
}  

ipcMain.on('openFile', (event) => { 
   const {dialog} = require('electron') 
   const fs = require('fs') 
   dialog.showOpenDialog(win, {properties: ['openDirectory']} ,function (fileNames) { 
      
      // fileNames is an array that contains all the selected 
      if(fileNames === undefined) { 
         console.log("No file selected"); 
      
      } else { 
        let data = walkSync(fileNames[0]);
        let text = data.join("<br>")
        event.sender.send('fileData', text) 
      } 
   });
   
   function walkSync  (dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
  
      filelist = fs.statSync(path.join(dir, file)).isDirectory()
        ? walkSync(path.join(dir, file), filelist)
        : filelist.concat(path.join(dir, file));
  
    });
    return filelist;
  }
})  

let count = 0;
ipcMain.on('send', (event) => {
  if(count++ % 2 == 0) {
    server.push("PAUS");
    server.push("SAVE", "C:\\Games\\Goemon - New Age Shutsudou! (Japan).State");
    server.push("GAME", "C:\\Games\\SOS (USA).sfc");
    server.push("LOAD", "C:\\Games\\SOS (USA).State");
    server.push("CONT");
  }
  else {
    server.push("PAUS");
    server.push("SAVE", "C:\\Games\\SOS (USA).State");
    server.push("GAME", "C:\\Games\\Goemon - New Age Shutsudou! (Japan).gba");
    server.push("LOAD", "C:\\Games\\Goemon - New Age Shutsudou! (Japan).State");
    server.push("CONT");
  }
})

app.on('ready', createWindow)