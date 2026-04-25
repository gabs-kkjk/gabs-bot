import { getUsers, getUser } from "../../utils/economy.js"

export default {
  name: "saldo",
  commands: ["saldo"],

  handle: async ({ sender, reply }) => {
    const users = getUsers()
    const user = getUser(users, sender)

    reply(`💰 carteira: ${user.saldo}\n🏦 banco: ${user.bank}\n⭐ level: ${user.level}`)
  }
}
