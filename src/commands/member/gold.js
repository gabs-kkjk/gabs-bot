import { PREFIX } from "../../config.js";
import { getUsers, getUser } from "../../utils/economy.js";

export default {
  name: "gold",
  description: "Mostra seu saldo em Gold.",
  commands: ["gold"],
  usage: `${PREFIX}gold`,
  handle: async ({ userLid, sendReply }) => {
    const users = getUsers();
    const user = getUser(users, userLid);
    await sendReply(`╓┉━─━┈━─━┉⟐\n💜 *SEU GOLD*\n\nGold: *${user.gold}*\n╙┉━─━┈━─━┉⟐`);
  },
};
