const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

/************************************************************************
 *  Globals
 ************************************************************************/
global.appRoot = path.resolve(__dirname);
global.win;

/************************************************************************
 *  Start components
 ************************************************************************/
require('./lib/server').init();
require('./lib/bizhawk');
require('./lib/filetree');

/************************************************************************
 *  Main behaviour
 ************************************************************************/

function createWindow() { 
  win = new BrowserWindow({width: 800, height: 600, 
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadURL(url.format ({ 
      pathname: path.join(__dirname, 'frontend/index.html'), 
      protocol: 'file:', 
      slashes: true
  }));
  win.webContents.openDevTools()
  global.win = win;
}

app.on('ready', createWindow)