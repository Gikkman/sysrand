const sqlite = require('sqlite');
const path = require('path');

const dbFilePath = path.join(global.appRoot, 'metadata.sqlite');
let db;

let init = async () => {
  db = await sqlite.open(dbFilePath, {cached: true});
  await db.migrate({ force: 'last' });
};
init();

module.exports.database = db;