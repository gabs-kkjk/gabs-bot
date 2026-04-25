import { getUsers, getUser } from "../../utils/economy.js"

export default {
  name: "inventario",
  commands: ["inventario"],

  handle: async ({ sender, reply }) => {
    const users = getUsers()
    const user = getUser(users, sender)

    if (user.inventario.length === 0) {
      return reply("inventário vazio 💔")
    }

    reply("🎒 " + user.inventario.join(", "))
  }
}
