import fs from "fs"

const file = "./database/economy.json"

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}")
  return JSON.parse(fs.readFileSync(file))
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

export const economy = {
  get: (key) => load()[key],
  set: (key, value) => {
    const db = load()
    db[key] = value
    save(db)
  },
  add: (key, value) => {
    const db = load()
    db[key] = (db[key] || 0) + value
    save(db)
  },
  sub: (key, value) => {
    const db = load()
    db[key] = (db[key] || 0) - value
    save(db)
  }
}