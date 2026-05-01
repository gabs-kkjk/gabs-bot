import { PREFIX } from "../../config.js";
import { getUsers } from "../../utils/economy.js";

export default {
  name: "rankgold",
  description: "Exibe os 10 usuários mais ricos.",
  commands: ["rankgold"],
  usage: `${PREFIX}rankgold`,
  handle: async ({ sendReply }) => {
    const users = getUsers();
    const ranking = Object.entries(users)
      .map(([id, data]) => ({ id, gold: Number(data.gold || data.saldo || 0) }))
      .sort((a, b) => b.gold - a.gold)
      .slice(0, 10);

    if (!ranking.length) return sendReply("💜 Ainda não há usuários no ranking.");

    const body = ranking
      .map((item, i) => `${i + 1}. ${item.id.split("@")[0]} — *${item.gold}* Gold`)
      .join("\n");

    await sendReply(`╓┉━─━┈━─━┉⟐\n💜 *RANK GOLD*\n\n${body}\n╙┉━─━┈━─━┉⟐`);
  },
};
