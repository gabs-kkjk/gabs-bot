import { isGroup } from "../../utils/index.js";

const games = {}; // estado em memória (por grupo)

export default {
  name: "jogo-numero",
  commands: ["jogo", "adivinhar"],
  handle: async ({ args, remoteJid, sendReply }) => {
    if (!isGroup(remoteJid)) return;

    // iniciar jogo
    if (args[0] === "start") {
      if (games[remoteJid]) {
        return sendReply("🎮 já tem um jogo em andamento!");
      }

      const number = Math.floor(Math.random() * 100) + 1;

      games[remoteJid] = {
        number,
        attempts: 0
      };

      return sendReply(
        "🎮 *Jogo iniciado!*\n\n" +
        "Adivinhe o número entre *1 e 100*\n" +
        "Use: `.jogo <número>`"
      );
    }

    // parar jogo
    if (args[0] === "stop") {
      if (!games[remoteJid]) {
        return sendReply("❌ nenhum jogo em andamento.");
      }

      delete games[remoteJid];
      return sendReply("🛑 jogo encerrado.");
    }

    // tentar adivinhar
    if (!games[remoteJid]) {
      return sendReply("❌ nenhum jogo ativo. Use `.jogo start`");
    }

    const guess = parseInt(args[0]);
    if (isNaN(guess)) {
      return sendReply("❌ envie um número válido.");
    }

    const game = games[remoteJid];
    game.attempts++;

    if (guess === game.number) {
      delete games[remoteJid];
      return sendReply(
        `🎉 *ACERTOU!*\n\n` +
        `Número: *${guess}*\n` +
        `Tentativas: *${game.attempts}*`
      );
    }

    if (guess < game.number) {
      return sendReply("🔼 é *maior*!");
    } else {
      return sendReply("🔽 é *menor*!");
    }
  },
};