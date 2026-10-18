import sqlite from "https://esm.town/v/std/sqlite/main.ts";

await sqlite.execute(`
CREATE TABLE IF NOT EXISTS "microposts" (
  "id" INTEGER PRIMARY KEY,
  "time" AS (strftime('%F %T', id, 'unixepoch')),
  "raw_text" TEXT NOT NULL,
  "rendered_text" TEXT,
  "tags" TEXT,
  "modified" INTEGER,
  "is_deleted" BOOLEAN DEFAULT(FALSE)
  );
`);