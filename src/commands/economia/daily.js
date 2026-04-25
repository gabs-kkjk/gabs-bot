import { getUsers, saveUsers, getUser } from "../../utils/economy.js"

export default {
  name: "daily",
  commands: ["daily"],

  handle: async ({ sender, reply }) => {
    const users = getUsers()
    const user = getUser(users, sender)

    const now = Date.now()

    if (now - user.lastDaily < 86400000) {
      return reply("já pegou hoje 💔")
    }

    const reward = Math.floor(Math.random() * 500) + 100

    user.saldo += reward
    user.lastDaily = now

    saveUsers(users)

    reply(`ganhou 💰 ${reward}`)
  }
}
