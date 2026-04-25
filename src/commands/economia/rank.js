import { getUsers } from "../../utils/economy.js"

export default {
  name: "rank",
  commands: ["rank"],

  handle: async ({ reply }) => {
    const users = getUsers()

    const ranking = Object.entries(users)
      .sort((a, b) => (b[1].saldo + b[1].bank) - (a[1].saldo + a[1].bank))
      .slice(0, 5)

    let msg = "🏆 TOP RICOS\n\n"

    ranking.forEach((u, i) => {
      msg += `${i + 1}. ${u[0]} - 💰 ${u[1].saldo + u[1].bank}\n`
    })

    reply(msg)
  }
}
