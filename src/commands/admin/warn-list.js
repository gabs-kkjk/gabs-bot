import fs from "fs"
import path from "path"
import { PREFIX } from "../../config.js"
import { onlyNumbers } from "../../utils/index.js"

const warnsPath = path.resolve("./database/warns.json")

export default {
  name: "warnlist",
  description: "Lista os avisos do grupo",
  commands: ["warnlist", "avisos"],
  usage: `${PREFIX}warnlist`,

  handle: async ({ remoteJid, sendReply, getGroupMetadata }) => {
    if (!fs.existsSync(warnsPath)) {
      return sendReply("ninguém tem warn nesse grupo 🙏")
    }

    const warns = JSON.parse(fs.readFileSync(warnsPath))
    const groupMetadata = await getGroupMetadata()

    let text = "📋 *Lista de warns do grupo*\n\n"
    let mentions = []
    let hasWarns = false

    for (const key in warns) {
      const [groupId, userId] = key.split(":")
      if (groupId !== remoteJid) continue

      const participant = groupMetadata.participants.find(
        (p) => p.id === userId
      )

      const isAdmin = participant?.admin
      const number = onlyNumbers(userId)

      text += `@${number} → ${warns[key]}/6 warns`
      if (isAdmin) text += " *(ADMIN)*"
      text += "\n"

      mentions.push(userId)
      hasWarns = true
    }

    if (!hasWarns) {
      return sendReply("ninguém tem warn nesse grupo 🙏")
    }

    await sendReply(text, mentions)
  },
}