import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { search } from "../../../services/spider-x-api.js";

export default {
  name: "google-search",
  description: "Consulta no Google",
  commands: ["google", "google-search"],
  usage: `${PREFIX}google Neymar`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ fullArgs, sendSuccessReply }) => {
    if (fullArgs.length <= 1) {
      throw new InvalidParameterError(
        "você precisa fornecer um termo para pesquisar no google."
      );
    }

    const maxLength = 100;

    if (fullArgs.length > maxLength) {
      throw new InvalidParameterError(
        `o tamanho máximo da pesquisa é de ${maxLength} caracteres.`
      );
    }

    const data = await search("google", fullArgs);

    if (!data || data.length === 0) {
      throw new WarningError(
        "não foi possível encontrar resultados para essa pesquisa."
      );
    }

    let text = "";

    for (const item of data) {
      text += `título: *${item.title || "sem título"}*\n\n`;
      text += `descrição: ${item.description || "sem descrição"}\n\n`;
      text += `url: ${item.url}\n\n`;
      text += `-----\n\n`;
    }

    await sendSuccessReply(
      `*pesquisa realizada 🔎*

*termo*: ${fullArgs}

*resultados*
${text}`
    );
  },
};