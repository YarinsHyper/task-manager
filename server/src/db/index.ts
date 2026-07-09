import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const dataDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../data"
);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "tasks.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// The one table this app has. Runs on every startup but is a no-op once
// the table already exists.
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    is_complete BOOLEAN NOT NULL DEFAULT FALSE CHECK (is_complete IN (FALSE, TRUE)),
    parent_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// The CREATE TABLE above only applies on a fresh db; existing dev databases
// created before subtasks existed need the column added on top.
const hasParentIdColumn = (db.prepare(`PRAGMA table_info(tasks)`).all() as { name: string }[])
  .some((column) => column.name === "parent_id");
if (!hasParentIdColumn) {
  db.exec(`ALTER TABLE tasks ADD COLUMN parent_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE`);
}
