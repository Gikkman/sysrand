const database = require("./database");

const TABLE = 'gameMetadata';
const COLS = ['fileHash', 'title', 'completed'];

let get = async(fileHash) => {
    return await database.get("SELECT " + COLS.join() + " FROM " + TABLE + " WHERE fileHash = ?", fileHash);
};

let save = async (metadata) => {
    if(!isCorrect(metadata)) {
        throw "Incorrect object layout."
            + " Metadata must have " + COLS.join() + " but found " + Object.keys(metadata).join();
    }
    let sql = "INSERT INTO " + TABLE + " (" + COLS.join() + ")"
        + " VALUES(?,?,?)"
        + " ON CONFLICT (fileHash) DO UPDATE SET title=?, completed=?";
    let params = [metadata.fileHash, metadata.title, metadata.completed, metadata.title, metadata.completed];
    database.run( sql, params);
}

function isCorrect(metadata) {
    return metadata.hasOwnProperty('title') 
        && metadata.hasOwnProperty('fileHash') 
        && metadata.hasOwnProperty('completed');
}

module.exports.get = get;
module.exports.save = save;