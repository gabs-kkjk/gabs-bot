import fs from "fs";
import path from "path";

const dbPath = path.resolve("database/add-groups.json");

function readDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ groups: [] }, null, 2)
    );
  }

  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function addGroup(groupJid) {
  const db = readDB();

  if (!db.groups.includes(groupJid)) {
    db.groups.push(groupJid);
    writeDB(db);
  }
}

export function hasGroup(groupJid) {
  const db = readDB();
  return db.groups.includes(groupJid);
}