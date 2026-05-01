import { PREFIX } from "../../config.js";
import { getUsers, getUser, saveUsers, pickRandom } from "../../utils/economy.js";

export default {
  name: "roubargold",
  description: "Tenta roubar Gold de um usuário marcado.",
  commands: ["roubargold"],
  usage: `${PREFIX}roubargold [@user]`,
  handle: async ({ sender, fullMessage, sendReply }) => {
    const mention = fullMessage.match(/@(\d{5,})/);
    if (!mention) return sendReply("💜 Marque quem você quer roubar.");

    const target = `${mention[1]}@s.whatsapp.net`;
    if (target === sender) return sendReply("💜 Você não pode roubar você mesmo.");

    const users = getUsers();
    const thief = getUser(users, sender);
    const victim = getUser(users, target);

    const success = Math.random() < 0.3;
    if (success && victim.gold > 0) {
      const value = Math.min(victim.gold, pickRandom(50, 500));
      victim.gold -= value;
      thief.gold += value;
      thief.economyStats.roubosSucesso += 1;
      victim.lastRobber = sender;
      victim.lastRobbedAt = Date.now();
      saveUsers(users);
      return sendReply(`💜 Roubo bem-sucedido! Você roubou *${value} Gold*.`);
    }

    const fine = pickRandom(30, 180);
    thief.gold = Math.max(0, thief.gold - fine);
    thief.economyStats.roubosFalha += 1;
    saveUsers(users);
    return sendReply(`💜 Roubo falhou. Você pagou multa de *${fine} Gold* ao Estado.`);
  },
};
