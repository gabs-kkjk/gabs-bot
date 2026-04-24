import { isGroup, onlyNumbers } from "../../utils/index.js";
import { readWarnDB } from "../../utils/warnDB.js";

export default {
  name: "check-user",
  commands: ["check-user", "check-warn"],
  handle: async ({ args, remoteJid, sendReply }) => {
    if (!isGroup(remoteJid)) return;

    if (!args[0]) {
      return sendReply("Marque alguém para verificar.");
    }

    const user = `${onlyNumbers(args[0])}@s.whatsapp.net`;
    const db = readWarnDB();

    const data = db[remoteJid]?.users?.[user];

    if (!data) {
      return sendReply(
        `👤 @${user.split("@")[0]}\n⚠️ Warns: 0/6\n🔇 Mutado: não`
      );
    }

    let muteInfo = "não";

    if (data.muteUntil && data.muteUntil > Date.now()) {
      const min = Math.ceil((data.muteUntil - Date.now()) / 60000);
      muteInfo = `sim (${min} min restantes)`;
    }

    sendReply(
      `👤 @${user.split("@")[0]}\n` +
      `⚠️ Warns: ${data.warns}/6\n` +
      `🔇 Mutado: ${muteInfo}`
    );
  },
};