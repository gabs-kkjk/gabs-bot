import { PREFIX } from "../../config.js";
import { getUsers, getUser, saveUsers } from "../../utils/economy.js";

export default {
  name: "doargold",
  description: "Doa Gold para outro usuário marcado.",
  commands: ["doargold"],
  usage: `${PREFIX}doargold [quantia] [@user]`,
  handle: async ({ sender, args, fullMessage, sendReply }) => {
    const amount = Number(args[0]);
    if (!Number.isInteger(amount) || amount <= 0) {
      return sendReply("💜 Informe uma quantia válida. Ex: !doargold 100 @user");
    }

    const mention = fullMessage.match(/@(\d{5,})/);
    if (!mention) return sendReply("💜 Marque um usuário para doar.");

    const receiver = `${mention[1]}@s.whatsapp.net`;
    if (receiver === sender) return sendReply("💜 Você não pode doar para si mesmo.");

    const users = getUsers();
    const from = getUser(users, sender);
    const to = getUser(users, receiver);

    if (from.gold < amount) return sendReply("💜 Saldo insuficiente para doação.");

    from.gold -= amount;
    to.gold += amount;
    saveUsers(users);
    await sendReply(`💜 Doação concluída: *${amount} Gold* enviado para @${mention[1]}.`);
  },
};
