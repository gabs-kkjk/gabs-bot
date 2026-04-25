import { getUsers, saveUsers, getUser } from "../../utils/economy.js"

export default {
  name: "depositar",
  commands: ["depositar"],

  handle: async ({ sender, args, reply }) => {
    const users = getUsers()
    const user = getUser(users, sender)

    const valor = parseInt(args[0])

    if (!valor) return reply("valor inválido")

    if (user.saldo < valor) {
      return reply("tu não tem isso 💔")
    }

    user.saldo -= valor
    user.bank += valor

    saveUsers(users)

    reply(`depositou ${valor}`)
  }
}
