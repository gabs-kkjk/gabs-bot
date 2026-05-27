import { isActiveChatInteractionGroup } from "../utils/database.js";
import { gemini } from "../services/spider-x-api.js";

/**
 * Middleware customizado para adicionar lógica personalizada
 * sem modificar os arquivos principais do bot.
 *
 * Este middleware é chamado em dois momentos:
 * 1. Antes de processar qualquer mensagem (type: "message")
 * 2. Antes de processar eventos de participantes add/remove (type: "participant")
 *
 * @param {CustomMiddlewareProps} params - Parâmetros do middleware
 *
 * Para exemplos de uso, consulte:
 * - README.md (seção "Custom Middleware")
 *
 * @author Dev Gui
 */

const replyCooldownByGroup = new Map();
const INTERACTION_COOLDOWN_MS = 120_000;
const AI_REPLY_CHANCE = 0.05;

function canReplyNow(groupId) {
  const lastReplyAt = replyCooldownByGroup.get(groupId) || 0;
  const now = Date.now();

  if (now - lastReplyAt < INTERACTION_COOLDOWN_MS) {
    return false;
  }

  return true;
}

function markReply(groupId) {
  const now = Date.now();
  replyCooldownByGroup.set(groupId, now);
}

function pickRandomReply(options) {
  return options[Math.floor(Math.random() * options.length)];
}

function toHumanLowercase(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export async function customMiddleware({
  socket,
  webMessage,
  type,
  commonFunctions,
  action,
  data,
}) {
  if (type !== "message" || !commonFunctions) {
    return;
  }

  const { fullMessage, prefix, sendReply, remoteJid, isGroup } = commonFunctions;

  if (!isGroup || !fullMessage) {
    return;
  }

  if (fullMessage.startsWith(prefix)) {
    return;
  }

  if (!isActiveChatInteractionGroup(remoteJid)) {
    return;
  }

  if (!canReplyNow(remoteJid)) {
    return;
  }

  if (Math.random() > 0.3) {
    return;
  }

  const normalizedText = fullMessage.toLowerCase();

  if (normalizedText.includes("bom dia")) {
    await sendReply(
      pickRandomReply([
        "Bom dia! Já começou no modo produtividade ou só no café? ☕",
        "Bom diaaa! Hoje promete, hein 😎",
        "Bom dia! Bora fazer esse grupo render 🫡",
      ])
    );
    markReply(remoteJid);
    return;
  }

  if (normalizedText.includes("to triste") || normalizedText.includes("tô triste")) {
    await sendReply(
      pickRandomReply([
        "Eita... quer desabafar? Tô por aqui 💛",
        "Poxa, sinto muito. Se quiser conversar, manda aí 💭",
        "Se estiver pesado, respira um pouco. Não tá sozinho(a) 💙",
      ])
    );
    markReply(remoteJid);
    return;
  }

  if (normalizedText.includes("vou dormir")) {
    await sendReply(
      pickRandomReply([
        "Dorme bem! Amanhã tu volta no modo lendário 😴",
        "Boa noite! Vai com Deus e descansa 🙏",
        "Fechou! Dorme cedo que teu eu do futuro agradece 🛌",
      ])
    );
    markReply(remoteJid);
    return;
  }

  const isEligibleForAiReply =
    fullMessage.length >= 8 &&
    !normalizedText.includes("http://") &&
    !normalizedText.includes("https://");

  if (!isEligibleForAiReply || Math.random() > AI_REPLY_CHANCE) {
    return;
  }

  const aiPrompt = [
    "responda como amigo de grupo no whatsapp.",
    "seja natural, direto e informal.",
    "escreva somente em letras minusculas.",
    "evite parecer robô, sem texto longo.",
    "mensagem do usuario:",
    fullMessage,
  ].join("\n");

  try {
    const aiResponse = await gemini(aiPrompt);

    if (!aiResponse) {
      return;
    }

    await sendReply(toHumanLowercase(aiResponse));
    markReply(remoteJid);
  } catch {
    // Evita quebrar o fluxo do bot quando a API estiver indisponível.
  }
}
