const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const sqlite3 = require('sqlite3');
const log = require('electron-log');
const unhandled = require('electron-unhandled');

console.log("Starting node " + process.version);

/************************************************************************
 *  Globals
 ************************************************************************/
global.appRoot = process.env.PORTABLE_EXECUTABLE_DIR 
  ? process.env.PORTABLE_EXECUTABLE_DIR 
  : path.resolve("./");
global.win;

/************************************************************************
 *  Log
 ************************************************************************/
log.transports.file.level = 'info';
log.transports.file.file = path.join(global.appRoot, 'log.log');
log.info("App started. Root path: " + global.appRoot);
unhandled({logger: log.error});

/************************************************************************
 *  Start components
 ************************************************************************/
require('./lib/server').init();
require('./lib/bizhawk');
require('./lib/filetree');
require('./lib/gamemeta');

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

function db() {
  const db = new sqlite3.Database('./file.db');
  db.serialize(function () {
    db.run("CREATE TABLE Products (name, barcode, quantity)", () => {});
  
    db.run("INSERT INTO Products VALUES (?, ?, ?)", ['product001', 'xxxxx', 20]);
    db.run("INSERT INTO Products VALUES (?, ?, ?)", ['product002', 'xxxxx', 40]);
    db.run("INSERT INTO Products VALUES (?, ?, ?)", ['product003', 'xxxxx', 60]);
  
    db.each("SELECT * FROM Products", function (err, row) {
      console.log(row);
    });
  });
}

db();