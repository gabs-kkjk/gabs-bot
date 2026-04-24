import fs from "fs"
import path from "path"

const dbPath = path.resolve("./database/tribunal.json")

// sessões globais
global.tribunalSessions = global.tribunalSessions || {}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default {
  name: "tribunal",
  commands: ["tribunal"],
  handle: async ({ args, remoteJid, sender, sendReply, getGroupMetadata }) => {
    
    const prefix = db.getPrefix ? db.getPrefix(remoteJid) : "." // 🔥 FIX

    const data = JSON.parse(fs.readFileSync(dbPath))

    // 📌 HELP
    if (!args[0]) {
      return sendReply(
        "⚖️ *Jogo do Tribunal*\n\n" +
        "Comandos:\n" +
        `${prefix}tribunal start\n` +
        `${prefix}tribunal votar culpado\n` +
        `${prefix}tribunal votar inocente`
      )
    }

    // ▶️ START
    if (args[0] === "start") {
      if (global.tribunalSessions[remoteJid]) {
        return sendReply("⚠️ Já existe um tribunal em andamento.")
      }

      const groupMetadata = await getGroupMetadata()
      const participants = groupMetadata.participants
        .map(p => p.id)
        .filter(id => id !== sender)

      if (participants.length < 2) {
        return sendReply("Poucas pessoas no grupo pra jogar.")
      }

      const suspect = getRandom(participants)
      const theme = getRandom(data.themes)

      global.tribunalSessions[remoteJid] = {
        suspect,
        votes: {},
        endsAt: Date.now() + 60_000
      }

      await sendReply("⚖️ *TRIBUNAL INICIADO*")
      await sendReply(`📚 *Tema:* ${theme}`)
      await sendReply(`👤 *Suspeito:* @${suspect.split("@")[0]}`, [suspect])
      await sendReply(
        "📜 *Como jogar:*\n" +
        "• Discuta no grupo\n" +
        "• Vote usando:\n\n" +
        `👉 *${prefix}tribunal votar culpado*\n` +
        `👉 *${prefix}tribunal votar inocente*\n\n` +
        "⏳ Tempo: 1 minuto"
      )

      // avisos
      ;[30, 15, 10].forEach(sec => {
        setTimeout(() => {
          if (global.tribunalSessions[remoteJid]) {
            sendReply(`⏰ Faltam ${sec} segundos!`)
          }
        }, (60 - sec) * 1000)
      })

      // final
      setTimeout(() => finishTribunal(remoteJid, sendReply, data), 60_000)
      return
    }

    // 🗳️ VOTAR
    if (args[0] === "votar") {
      const vote = args[1]
      const session = global.tribunalSessions[remoteJid]

      if (!session) return sendReply("❌ Nenhum tribunal ativo.")
      if (!["culpado", "inocente"].includes(vote)) return

      session.votes[sender] = vote
      return sendReply("🗳️ Voto computado!")
    }
  }
}

function finishTribunal(groupId, sendReply, data) {
  const session = global.tribunalSessions[groupId]
  if (!session) return

  let guilty = 0
  let innocent = 0

  Object.values(session.votes).forEach(v => {
    if (v === "culpado") guilty++
    if (v === "inocente") innocent++
  })

  let result
  if (guilty === innocent) {
    result = Math.random() < 0.5 ? "culpado" : "inocente"
  } else {
    result = guilty > innocent ? "culpado" : "inocente"
  }

  const text =
    result === "inocente"
      ? getRandom(data.innocentTexts)
      : getRandom(data.guiltyTexts)

  sendReply(
    `⚖️ *RESULTADO DO TRIBUNAL*\n\n` +
    `🗳️ Culpado: ${guilty}\n` +
    `🗳️ Inocente: ${innocent}\n\n` +
    `📢 *Veredito:* ${result.toUpperCase()}\n\n` +
    text
  )

  delete global.tribunalSessions[groupId]
}