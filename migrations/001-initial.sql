-- Up
CREATE TABLE "gameMetadata" (
    "metadataId" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "title" TEXT NOT NULL, 
    "fileHash" TEXT NOT NULL, 
    "completed" BOOLEAN DEFAULT 0
);

CREATE UNIQUE INDEX "gameMetadata_fileHash" ON "gameMetadata" ("fileHash");

-- Down
DROP TABLE "gameMetadata";