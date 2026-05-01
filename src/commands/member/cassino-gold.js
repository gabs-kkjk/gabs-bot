import { PREFIX } from "../../config.js";
import { getUsers, getUser, saveUsers } from "../../utils/economy.js";

export default {
  name: "cassino-gold",
  description: "Aposte Gold com 50% de chance de dobrar ou perder.",
  commands: ["cassino"],
  usage: `${PREFIX}cassino [valor]`,
  handle: async ({ sender, args, sendReply }) => {
    const bet = Number(args[0]);
    if (!Number.isInteger(bet) || bet <= 0) return sendReply("💜 Informe uma aposta válida.");

    const users = getUsers();
    const user = getUser(users, sender);
    if (user.gold < bet) return sendReply("💜 Saldo insuficiente para apostar.");

    const won = Math.random() < 0.5;
    user.gold -= bet;

    if (won) {
      const prize = bet * 2;
      user.gold += prize;
      user.economyStats.casinoLucroTotal += bet;
      saveUsers(users);
      return sendReply(`💜 Você venceu no cassino!\nPrêmio: *${prize} Gold*\nSaldo: *${user.gold}*`);
    }

    user.economyStats.casinoLucroTotal -= bet;
    saveUsers(users);
    return sendReply(`💜 Você perdeu *${bet} Gold* no cassino.\nSaldo: *${user.gold}*`);
  },
};
