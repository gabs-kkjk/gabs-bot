import fs from "fs"
import path from "path"

const pathUsers = path.resolve("./database/users.json")

export function getUsers() {
  if (!fs.existsSync(pathUsers)) {
    fs.writeFileSync(pathUsers, JSON.stringify({}))
  }
  return JSON.parse(fs.readFileSync(pathUsers))
}

export function saveUsers(users) {
  fs.writeFileSync(pathUsers, JSON.stringify(users, null, 2))
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
