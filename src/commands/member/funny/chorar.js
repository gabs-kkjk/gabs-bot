import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "chorar",
  description: "Começa a chorar 😭",
  commands: ["chorar", "cry", "chorando"],
  usage: `${PREFIX}chorar (@usuario opcional)`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendGifFromFile,
    sendErrorReply,
    userLid,
    replyLid,
    args,
    isReply,
  }) => {

    const userNumber = onlyNumbers(userLid);

    // se NÃO marcou ninguém
    if (!args.length && !isReply) {
      await sendGifFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "cry-alone.gif"),
        `😭 @${userNumber} está chorando sozinho no canto... que depressão 💔`,
        [userLid]
      );
      return;
    }

    // se marcou alguém
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : null;

    if (!targetLid) {
      await sendErrorReply(
        "Você precisa mencionar um usuário ou responder uma mensagem."
      );
      return;
    }

    const targetNumber = onlyNumbers(targetLid);

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "cry-anime.gif"),
      `😭 @${userNumber} está chorando por causa de @${targetNumber}... que dor 💔`,
      [userLid, targetLid]
    );
  },
};