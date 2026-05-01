import { PREFIX } from "../../config.js";
import { getUsers, getUser, saveUsers, pickRandom, formatCooldown } from "../../utils/economy.js";

const COOLDOWN = 30 * 60 * 1000;

export default {
  name: "minerar-gold",
  description: "Trabalha para ganhar Gold com cooldown de 30 minutos.",
  commands: ["minerar_gold", "minerargold"],
  usage: `${PREFIX}minerar_gold`,
  handle: async ({ userLid, sendReply }) => {
    const users = getUsers();
    const user = getUser(users, userLid);
    const now = Date.now();

    if (now - user.lastMinerar < COOLDOWN) {
      const left = COOLDOWN - (now - user.lastMinerar);
      return sendReply(`💜 Você ainda está cansado. Volte em *${formatCooldown(left)}*.`);
    }

    const mined = pickRandom(75, 340);
    user.gold += mined;
    user.lastMinerar = now;
    user.economyStats.mineradas += 1;
    saveUsers(users);

    await sendReply(`╓┉━─━┈━─━┉⟐\n💜 *MINERAÇÃO*\n\nVocê minerou *${mined} Gold*\nSaldo atual: *${user.gold}*\n╙┉━─━┈━─━┉⟐`);
  },
};
