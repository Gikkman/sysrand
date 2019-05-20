import {app, BrowserWindow} from 'electron';
const url = require('url');
const path = require('path');
const log = require('electron-log');
const unhandled = require('electron-unhandled');

/************************************************************************
 *  Globals
 ************************************************************************/
var appRoot: string = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : path.resolve('./');
var window: BrowserWindow;

/************************************************************************
 *  Log
 ************************************************************************/
log.transports.file.level = 'info';
log.transports.file.file = path.join(appRoot, 'log.log');
log.transports.console.level = 'silly';
unhandled({logger: log.error});

log.info("Starting node " + process.version);
log.info("App started. Root path: " + appRoot);

/************************************************************************
 *  Start components
 ************************************************************************/
require('./backend/server').init();
require('./backend/repositories/database');
require('./backend/bizhawk');
require('./backend/filetree');
require('./backend/gamemeta');

/************************************************************************
 *  Main behaviour
 ************************************************************************/
function createWindow() { 
  window = new BrowserWindow({width: 800, height: 600, 
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadURL(url.format ({ 
      pathname: path.join(__dirname, './frontend/index.html'), 
      protocol: 'file:', 
      slashes: true
  }));
  window.webContents.openDevTools()
}

app.on('ready', createWindow)