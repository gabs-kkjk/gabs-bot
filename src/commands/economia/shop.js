import fs from "fs"
import path from "path"
import { getUsers, getUser, saveUsers } from "../../utils/economy.js"

const shopPath = path.resolve("./database/shop.json")

export default {
  name: "shop",
  commands: ["shop"],

  handle: async ({ args, sender, reply }) => {
    const shop = JSON.parse(fs.readFileSync(shopPath))
    const users = getUsers()
    const user = getUser(users, sender)

    if (!args[0]) {
      let msg = "🛒 LOJA\n\n"
      shop.forEach(i => {
        msg += `${i.id} - 💰 ${i.preco}\n`
      })
      return reply(msg)
    }

    if (args[0] === "comprar") {
      const item = shop.find(i => i.id === args[1])

      if (!item) return reply("não existe 💔")

      if (user.saldo < item.preco) {
        return reply("tu é pobre 💀")
      }

      user.saldo -= item.preco
      user.inventario.push(item.id)

      saveUsers(users)

      return reply(`comprou ${item.nome}`)
    }
  }
}
