import { getUsers, saveUsers, getUser, addXp } from "../../utils/economy.js"

export default {
  name: "trabalhar",
  commands: ["trabalhar"],

  handle: async ({ sender, reply }) => {
    const users = getUsers()
    const user = getUser(users, sender)

    const now = Date.now()

    if (now - user.lastWork < 600000) {
      return reply("descansa aí CLT 💀")
    }

    const ganho = Math.floor(Math.random() * 300) + 50

    user.saldo += ganho
    user.lastWork = now

    const up = addXp(user, 20)

    saveUsers(users)

    reply(`ganhou 💰 ${ganho}` + (up ? "\n🎉 level up!" : ""))
  }
}
