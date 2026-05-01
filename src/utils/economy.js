import fs from "fs"
import path from "path"

const legacyUsersPath = path.resolve("./database/users.json")
const usersDir = path.resolve("./database/users")

function ensureUsersDir() {
  if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true })
  }
}

function ensureLegacyFile() {
  if (!fs.existsSync(legacyUsersPath)) {
    fs.writeFileSync(legacyUsersPath, JSON.stringify({}))
  }
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9@._-]/g, "_")
}

function getUserFilePath(sender) {
  return path.join(usersDir, `${sanitizeId(sender)}.json`)
}

export function getUsers() {
  ensureUsersDir()
  ensureLegacyFile()

  const users = {}

  const userFiles = fs.readdirSync(usersDir).filter((file) => file.endsWith(".json"))
  for (const file of userFiles) {
    const full = path.join(usersDir, file)
    try {
      const data = JSON.parse(fs.readFileSync(full))
      if (data?.id) users[data.id] = data
    } catch {
      // ignora arquivo inválido
    }
  }

  if (Object.keys(users).length === 0) {
    const legacy = JSON.parse(fs.readFileSync(legacyUsersPath))
    for (const [id, data] of Object.entries(legacy)) {
      users[id] = data
    }
  }

  return users
}

export function saveUsers(users) {
  ensureUsersDir()

  for (const [id, data] of Object.entries(users)) {
    const payload = {
      id,
      ...data
    }
    fs.writeFileSync(getUserFilePath(id), JSON.stringify(payload, null, 2))
  }
}

export function getUser(users, sender) {
  if (!users[sender]) {
    users[sender] = {
      saldo: 500,
      bank: 0,
      xp: 0,
      level: 1,
      inventario: [],
      lastDaily: 0,
      lastWork: 0
    }
  }

  if (typeof users[sender].gold !== "number") users[sender].gold = users[sender].saldo || 0
  if (typeof users[sender].lastMinerar !== "number") users[sender].lastMinerar = users[sender].lastWork || 0
  if (!users[sender].economyStats) {
    users[sender].economyStats = {
      mineradas: 0,
      roubosSucesso: 0,
      roubosFalha: 0,
      casinoLucroTotal: 0
    }
  }

  return users[sender]
}

export function addXp(user, amount) {
  user.xp += amount

  const need = user.level * 100

  if (user.xp >= need) {
    user.level++
    user.xp = 0
    return true
  }

  return false
}

export function formatCooldown(ms) {
  const total = Math.ceil(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60

  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function pickRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
