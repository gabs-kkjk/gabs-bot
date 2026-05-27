import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  activateChatInteractionGroup,
  deactivateChatInteractionGroup,
  isActiveChatInteractionGroup,
} from "../../utils/database.js";

export default {
  name: "interacao",
  description: "Ativa/desativa interações automáticas de personalidade no grupo.",
  commands: ["interacao", "modo-humano"],
  usage: `${PREFIX}interacao (1/0)`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "Você precisa digitar 1 ou 0 (ligar ou desligar)!"
      );
    }

    const interactionOn = args[0] == "1";
    const interactionOff = args[0] == "0";

    if (!interactionOn && !interactionOff) {
      throw new InvalidParameterError(
        "Você precisa digitar 1 ou 0 (ligar ou desligar)!"
      );
    }

    const hasActive = interactionOn && isActiveChatInteractionGroup(remoteJid);
    const hasInactive = interactionOff && !isActiveChatInteractionGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `O modo de interação já está ${interactionOn ? "ativado" : "desativado"}!`
      );
    }

    if (interactionOn) {
      activateChatInteractionGroup(remoteJid);
    } else {
      deactivateChatInteractionGroup(remoteJid);
    }

    await sendSuccessReact();
    await sendReply(
      `Modo de interação ${interactionOn ? "ativado" : "desativado"} com sucesso!`
    );
  },
};
