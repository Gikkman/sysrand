const database = require("./database");

const TABLE = 'game_metadata';
const ID_COL = 'id';
const TITLE_COL = 'title';
const HASHCODE_COL = 'file_hash';
const COMPLETED_COL = 'completed';
const COLS = [ID_COL, TITLE_COL, HASHCODE_COL, COMPLETED_COL];

let get = async(fileHash) => {
    return await database.get("SELECT "+ COLS.join() +" FROM "+TABLE+" WHERE "+HASHCODE_COL+" = ?", fileHash);
};

let save = async (metadata) => {
    if(!isCorrect(metadata)) {
        throw "Incorrect object layout."
            + " Metadata must have " + COLS.join() + " but found " + Object.keys(metadata).join();
    }
    let existingMetadata = await get(metaData.fileHash);
    if(existingMetadata) {
        await database.run("INSERT INTO " + TABLE + "("+ COLS.join() +") VALUES (:title, :file_hash, :completed)", metadata)
    }
    else {
        await database.run(
            "UPDATE " + TABLE 
            + " SET " 
                + TITLE_COL + "=:" + TITLE_COL + ","
                + COMPLETED_COL + "=:" + COMPLETED_COL
            + " WHERE file_hash = :file_hash", 
            metadata);
    }
}

function isCorrect(metadata) {
    return metaData.hasOwnproperty(ID_COL) 
        && metaData.hasOwnproperty(TITLE_COL) 
        && metaData.hasOwnproperty(HASHCODE_COL) 
        && metaData.hasOwnproperty(COMPLETED_COL);
}

module.exports.get = get;
module.exports.save = save;