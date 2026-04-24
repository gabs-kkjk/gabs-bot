// debate.js
const topics = [
  "Pizza com ou sem ketchup?",
  "Celular deveria ser proibido na escola?",
  "Dinheiro traz felicidade?",
  "Anime é melhor que série?",
  "Dormir tarde ou acordar cedo?",
  "Jogo online ou offline?",
  "Música antiga ou atual?",
  "Ficar rico ou famoso?",
  "Prefere calor ou frio?",
  "Trabalho dos sonhos ou dinheiro garantido?"
]

// sessões por grupo
global.debateSessions = global.debateSessions || {}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickTopic() {
  return topics[Math.floor(Math.random() * topics.length)]
}

function startLoop(groupId, sendReply) {
  const delay = random(10_000, 30_000) // 10 a 30 segundos

  global.debateSessions[groupId].timeout = setTimeout(() => {
    if (!global.debateSessions[groupId]) return

    const topic = pickTopic()
    sendReply(`🗣️ *Debate aberto!*\n\n💬 Assunto:\n👉 ${topic}`)

    // chama de novo com tempo diferente
    startLoop(groupId, sendReply)
  }, delay)
}

export default {
  name: "debate",
  commands: ["debate"],
  handle: async ({ args, remoteJid, sendReply }) => {
    const sub = args[0]

    // ▶️ start
    if (sub === "start") {
      if (global.debateSessions[remoteJid]) {
        return sendReply("⚠️ Já tem um debate rodando nesse grupo.")
      }

      global.debateSessions[remoteJid] = {}

      sendReply("✅ Debate automático iniciado!\nOs assuntos vão mudar em tempos aleatórios.")
      startLoop(remoteJid, sendReply)
      return
    }

    // ⏹ stop
    if (sub === "stop") {
      const session = global.debateSessions[remoteJid]
      if (!session) {
        return sendReply("⚠️ Não tem debate ativo.")
      }

      clearTimeout(session.timeout)
      delete global.debateSessions[remoteJid]

      return sendReply("🛑 Debate encerrado.")
    }

    // 🔄 trocar manualmente
    if (sub === "trocar") {
      if (!global.debateSessions[remoteJid]) {
        return sendReply("⚠️ Inicia o debate primeiro com *debate start*.")
      }

      const topic = pickTopic()
      return sendReply(`🔄 *Novo assunto!*\n\n💬 ${topic}`)
    }

    // ajuda
    sendReply(
      `🗣️ *Comandos do Debate*\n\n` +
      `▶️ debate start — inicia\n` +
      `🔄 debate trocar — troca o assunto\n` +
      `⏹ debate stop — para tudo`
    )
  }
}