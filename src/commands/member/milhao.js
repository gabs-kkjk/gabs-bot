import fs from "fs"
import path from "path"

const gamePath = path.resolve("database/milhao.json")

const sessions = {}

const prizes = [
  0, 1000, 2000, 5000, 10000,
  20000, 50000, 100000, 200000,
  300000, 500000, 600000, 700000,
  800000, 900000, 1000000
]

function getStage(level) {
  if (level <= 5) return "0"
  if (level <= 10) return "1"
  if (level <= 15) return "2"
  return "3"
}

export default {
  name: "milhao",
  commands: ["milhao"],

  handle: async ({ args, sender, sendReply, remoteJid }) => {
    const userId = sender
    const gameId = `${remoteJid}-${userId}` // 🔥 trava por grupo + usuário

    if (!args[0]) {
      return sendReply(
        "🎮 *Jogo do Milhão*\n\n" +
        "∆milhao start\n" +
        "∆milhao a/b/c/d\n" +
        "∆milhao parar"
      )
    }

    // START
    if (args[0] === "start") {
      if (sessions[gameId]) {
        return sendReply("❌ você já está jogando.")
      }

      sessions[gameId] = {
        owner: userId,
        level: 1,
        used: {},
        question: null
      }

      return sendQuestion(gameId, sendReply)
    }

    // PARAR
    if (args[0] === "parar") {
      const session = sessions[gameId]
      if (!session) return sendReply("❌ você não está jogando.")

      const lvl = session.level - 1
      const prize = prizes[lvl]

      delete sessions[gameId]

      return sendReply(`🛑 Você parou e levou *R$ ${prize.toLocaleString()}*`)
    }

    const session = sessions[gameId]

    // 🔥 impede qualquer outro usuário
    if (!session) {
      return sendReply("❌ você não iniciou um jogo.")
    }

    if (session.owner !== userId) {
      return sendReply("❌ só quem iniciou o jogo pode responder.")
    }

    const answer = ["a", "b", "c", "d"].indexOf(args[0].toLowerCase())
    if (answer === -1) return

    if (!session.question) {
      return sendReply("⚠️ erro: pergunta não encontrada.")
    }

    if (answer === session.question.answer) {
      const prize = prizes[session.level]

      // checkpoint
      if (session.level >= 10) {
        session.level++
        return sendReply(
          `✅ *Resposta correta!*\n` +
          `💰 Ganhando: R$ ${prize.toLocaleString()}\n\n` +
          `⚠️ Deseja continuar?\n` +
          `👉 ∆milhao a/b/c/d\n` +
          `👉 ∆milhao parar`
        )
      }

      session.level++

      if (session.level > 15) {
        delete sessions[gameId]
        return sendReply("🏆 *PARABÉNS!* Você ganhou *R$ 1.000.000* 🎉")
      }

      return sendQuestion(gameId, sendReply)

    } else {
      const prize = prizes[session.level - 1]

      delete sessions[gameId]

      return sendReply(
        `❌ *Resposta errada!*\n` +
        `💰 Você levou *R$ ${prize.toLocaleString()}*`
      )
    }
  }
}

function sendQuestion(gameId, sendReply) {
  const session = sessions[gameId]
  const data = JSON.parse(fs.readFileSync(gamePath))

  const stage = getStage(session.level)

  if (!session.used[stage]) session.used[stage] = []

  const questions = data[stage]

  const available = questions.filter(
    (_, i) => !session.used[stage].includes(i)
  )

  if (!available.length) {
    return sendReply("⚠️ Acabaram as perguntas dessa fase.")
  }

  const index = Math.floor(Math.random() * available.length)
  const realIndex = questions.indexOf(available[index])

  session.used[stage].push(realIndex)
  session.question = available[index]

  sendReply(
    `💰 *Jogo do Milhão*\n\n` +
    `⭐ Nível: ${session.level}/15\n` +
    `💵 Valendo: R$ ${prizes[session.level].toLocaleString()}\n\n` +
    `❓ ${session.question.q}\n\n` +
    `a) ${session.question.options[0]}\n` +
    `b) ${session.question.options[1]}\n` +
    `c) ${session.question.options[2]}\n` +
    `d) ${session.question.options[3]}`
  )
}