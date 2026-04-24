import fs from "fs";
import path from "path";

const dbPath = path.resolve("database/warn.json");

export function readWarnDB() {
  if (!fs.existsSync(dbPath)) return {};
  return JSON.parse(fs.readFileSync(dbPath));
}

export function saveWarnDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}