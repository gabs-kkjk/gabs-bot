import { PREFIX } from "../../config.js";

export default {
  name: "shiprandom",
  description: "Shipa duas pessoas aleatórias 😈",
  commands: ["shiprandom", "shipr"],
  usage: `${PREFIX}shiprandom`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendText, sendErrorReply, socket, remoteJid }) => {

    if (!remoteJid.endsWith("@g.us")) {
      return await sendErrorReply("esse comando só funciona em grupo 💀");
    }

    const { participants } = await socket.groupMetadata(remoteJid);

    if (!participants || participants.length < 2) {
      return await sendErrorReply("não tem gente suficiente pra shipar 😭");
    }

    // pega 2 aleatórios
    const random1 =
      participants[Math.floor(Math.random() * participants.length)].id;

    let random2 =
      participants[Math.floor(Math.random() * participants.length)].id;

    while (random1 === random2) {
      random2 =
        participants[Math.floor(Math.random() * participants.length)].id;
    }

    const user1 = random1.split("@")[0];
    const user2 = random2.split("@")[0];

    const porcentagem = Math.floor(Math.random() * 101);

    let resultado = "irmao💔";
    if (porcentagem > 20) resultado = "achei paia";
    if (porcentagem > 40) resultado = "sei nao";
    if (porcentagem > 60) resultado = "eu shippo hein";
    if (porcentagem > 80) resultado = "casalzao heinkkkjkk🔥";
    if (porcentagem > 95) resultado = "💍 CASA IMEDIATAMENTE";

    await sendText(
      `🎲 *SHIP ALEATÓRIO*\n\n@${user1} + @${user2}\n\nCompatibilidade: *${porcentagem}%*\nResultado: ${resultado} `,
      [random1, random2]
    );
  },
};