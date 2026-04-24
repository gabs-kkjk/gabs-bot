import { isGroup } from "../../utils/index.js";
import { InvalidParameterError } from "../../errors/index.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: "autodestruir",
  description: "Contagem regressiva e o bot sai do grupo (zoas)",
  commands: ["auto-destruir", "self-destruct"],
  handle: async ({ socket, remoteJid, isAdmin, isOwner, sendReply }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupo.");
    }


    await sendReply("💣 *PROTOCOLO DE AUTO-DESTRUIÇÃO ATIVADO*");

    await sleep(1500);
    await sendReply("⏳ Saindo em 5...");
    await sleep(1000);
    await sendReply("⏳ 4...");
    await sleep(1000);
    await sendReply("⏳ 3...");
    await sleep(1000);
    await sendReply("⏳ 2...");
    await sleep(1000);
    await sendReply("⏳ 1...");

    await sleep(1000);
    await sendReply("💥 *BOOM!* Até mais, humanos 🤖");

    await sleep(500);
    await socket.groupLeave(remoteJid);
  },
};