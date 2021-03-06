const sqlite = require('sqlite');
const path = require('path');
const log = require('electron-log');

let appRoot = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : path.resolve('./');

const dbFilePath = path.join(appRoot, 'metadata.sqlite');
let db;

let init = async () => {
  db = await sqlite.open(dbFilePath, {Promise, cached: true, trace: log.silly});
  await db.migrate({ force: 'last' });  
};

let get = async(sql, params) => {
  return await db.get(sql, params);
}

let run = async(sql, params) => {
  return await db.run(sql, params);
}

module.exports.get = get;
module.exports.run = run;

init();