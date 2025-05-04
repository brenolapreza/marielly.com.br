-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section" INTEGER NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "content" JSONB,
    "button" JSONB,
    "cards" JSONB,
    "buttons" JSONB
);
