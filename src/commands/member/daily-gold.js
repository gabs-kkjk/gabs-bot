import { PREFIX } from "../../config.js";
import { getUsers, getUser, saveUsers, pickRandom, formatCooldown } from "../../utils/economy.js";

const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

export default {
  name: "daily-gold",
  description: "Resgata bônus diário de Gold.",
  commands: ["daily"],
  usage: `${PREFIX}daily`,
  handle: async ({ userLid, sendReply }) => {
    const users = getUsers();
    const user = getUser(users, userLid);
    const now = Date.now();

    if (now - user.lastDaily < DAILY_COOLDOWN) {
      const left = DAILY_COOLDOWN - (now - user.lastDaily);
      return sendReply(`💜 Você já resgatou hoje. Volte em *${formatCooldown(left)}*.`);
    }

    const reward = pickRandom(250, 900);
    user.gold += reward;
    user.lastDaily = now;
    saveUsers(users);

    await sendReply(`💜 Daily coletado! Você ganhou *${reward} Gold*\nSaldo: *${user.gold}*`);
  },
};
