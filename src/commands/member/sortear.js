import { isGroup } from "../../utils/index.js";
import { InvalidParameterError } from "../../errors/index.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default {
  name: "sortear",
  description: "Sorteia um membro do grupo (com suspense e troll)",
  commands: ["sortear", "sorteio", "random"],
  usage: "sortear",

  handle: async ({ socket, remoteJid }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError(
        "este comando só pode ser usado em grupo."
      );
    }

    const metadata = await socket.groupMetadata(remoteJid);

    const participantes = metadata.participants
      .map((p) => p.id)
      .filter((id) => !id.includes("g.us"));

    if (!participantes.length) {
      throw new InvalidParameterError("não há membros para sortear.");
    }

    // suspense inicial
    await socket.sendMessage(remoteJid, {
      text: "🎲 iniciando sorteio... silêncio no chat 😈",
    });

    await sleep(1500);

    await socket.sendMessage(remoteJid, {
      text: "analisando histórico... 😭💔",
    });

    await sleep(1500);

    await socket.sendMessage(remoteJid, {
      text: "verificando quem deve dinheiro 👀🔥",
    });

    await sleep(1500);

    await socket.sendMessage(remoteJid, {
      text: "quase lá... se for você, aceita o destino ✌🏻",
    });

    await sleep(2000);

    const sorteado =
      participantes[Math.floor(Math.random() * participantes.length)];

    const mensagemFinal = `
🔥💔 *resultado oficial*
o universo decidiu.
parabéns (ou não): @${sorteado.split("@")[0]} 😭
`;

    await socket.sendMessage(remoteJid, {
      text: mensagemFinal,
      mentions: [sorteado],
    });
  },
};