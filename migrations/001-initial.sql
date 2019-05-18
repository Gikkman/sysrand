-- Up
CREATE TABLE "gameMetadata" (
    "fileHash" TEXT PRIMARY KEY NOT NULL,
    "title" TEXT NOT NULL, 
    "completed" BOOLEAN NOT NULL DEFAULT 0
);

-- Down
DROP TABLE "gameMetadata";