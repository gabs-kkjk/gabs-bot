import { getUsers, saveUsers, getUser } from "../../utils/economy.js"

export default {
  name: "sacar",
  commands: ["sacar"],

  handle: async ({ sender, args, reply }) => {
    const users = getUsers()
    const user = getUser(users, sender)

    const valor = parseInt(args[0])

    if (!valor) return reply("valor inválido")

    if (user.bank < valor) {
      return reply("não tem isso no banco 💀")
    }

    user.bank -= valor
    user.saldo += valor

    saveUsers(users)

    reply(`sacou ${valor}`)
  }
}
