import lottie from "../../utils/lottie.cjs";
import fs from "fs";
import path from "path";

const { buildLottieSticker } = lottie;

export default {
  name: "lottie",
  description: "figurinha animada",
  commands: ["lottie"],

  handle: async (paramsHandler) => {
    const {
      sendWaitReact,
      sendSuccessReact,
      sendStickerFromBuffer
    } = paramsHandler;

    try {
      await sendWaitReact();

      const arg = paramsHandler.args?.[0] || "animation";

      const baseFolder = path.resolve(`./assets/lottie/${arg}`);

      const output = await buildLottieSticker({
        baseFolder,
        imagePath: path.resolve("./assets/images/default-user.png"),
        jsonRelativePath: "animation/animation_secondary.json"
      });

      const buffer = fs.readFileSync(output);

      // 🔥 envio correto
      await paramsHandler.sock.sendMessage(paramsHandler.remoteJid, {
  sticker: buffer,
  mimetype: "application/was"
});

      await sendSuccessReact();

    } catch (err) {
      console.log(err);
    }
  }
};
