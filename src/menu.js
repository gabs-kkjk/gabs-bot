import pkg from "../package.json" with { type: "json" };
import { BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

export function menuMessage(groupJid) {
  const date = new Date();
  const prefix = getPrefix(groupJid);

  return `
╭━━━〔  ${BOT_NAME} 〕━━━╮
┃ ✦ bem-vindo ao sistema
┃ ✦ bot atualizado e operacional
┃ ✦ suporte: wa.me/5583991823719
╰━━━━━━━━━━━━━━━━━━━━━━╯

┌─〔 📊 informações 〕
│ • nome: ${BOT_NAME}
│ • data: ${date.toLocaleDateString("pt-br")}
│ • hora: ${date.toLocaleTimeString("pt-br")}
│ • prefixo: ${prefix}
│ • versão: ${pkg.version}
└───────────────

${readMore()}

┌─〔 👑 dono 〕
│ ${prefix}exec
│ ${prefix}get-group-id
│ ${prefix}off
│ ${prefix}on
│ ${prefix}set-menu-image
│ ${prefix}set-prefix
│ ${prefix}set-spider-api-token
└───────────────

┌─〔 🛡 admins 〕
│ ${prefix}abrir
│ ${prefix}fechar
│ ${prefix}ban
│ ${prefix}mute
│ ${prefix}unmute
│ ${prefix}promover
│ ${prefix}rebaixar
│ ${prefix}delete
│ ${prefix}limpar
│ ${prefix}hidetag
│ ${prefix}link-grupo
│ ${prefix}welcome (1/0)
│ ${prefix}only-admin (1/0)
│ ${prefix}auto-responder (1/0)
│ ${prefix}auto-sticker (1/0)
│ ${prefix}add-auto-responder
│ ${prefix}delete-auto-responder
│ ${prefix}list-auto-responder
│ ${prefix}agendar-mensagem
│ ${prefix}exit (1/0)
│ ${prefix}saldo
│ ${prefix}set-proxy
│ ${prefix}revelar
│ ${prefix}anti-audio (1/0)
│ ${prefix}anti-document (1/0)
│ ${prefix}anti-event (1/0)
│ ${prefix}anti-image (1/0)
│ ${prefix}anti-link (1/0)
│ ${prefix}anti-lottie-sticker (1/0)
│ ${prefix}anti-product (1/0)
│ ${prefix}anti-sticker (1/0)
│ ${prefix}anti-video (1/0)
└───────────────

┌─〔 ⚡ principal 〕
│ ${prefix}attp
│ ${prefix}brat
│ ${prefix}cep
│ ${prefix}exemplos-de-mensagens
│ ${prefix}fake-chat
│ ${prefix}gerar-link
│ ${prefix}info
│ ${prefix}meu-lid
│ ${prefix}perfil
│ ${prefix}ping
│ ${prefix}raw-message
│ ${prefix}rename
│ ${prefix}sticker
│ ${prefix}suporte
│ ${prefix}to-gif
│ ${prefix}to-image
│ ${prefix}to-mp3
│ ${prefix}ttp
│ ${prefix}yt-search
│ ${prefix}jogo 🎮
└───────────────

┌─〔 📥 downloads 〕
│ ${prefix}facebook
│ ${prefix}instagram
│ ${prefix}play-audio
│ ${prefix}play-video
│ ${prefix}pinterest
│ ${prefix}tik-tok
│ ${prefix}yt-mp3
│ ${prefix}yt-mp4
└───────────────

┌─〔 🎡 brincadeiras 〕
│ ${prefix}abracar
│ ${prefix}beijar
│ ${prefix}dado
│ ${prefix}jantar
│ ${prefix}lutar
│ ${prefix}matar
│ ${prefix}socar
└───────────────

┌─〔 🧠 ia 〕
│ ${prefix}flux
│ ${prefix}gemini
│ ${prefix}gpt-5-mini
│ ${prefix}ia-sticker
└───────────────

┌─〔 🎨 canvas 〕
│ ${prefix}blur
│ ${prefix}bolsonaro
│ ${prefix}cadeia
│ ${prefix}contraste
│ ${prefix}espelhar
│ ${prefix}gray
│ ${prefix}inverter
│ ${prefix}pixel
│ ${prefix}rip
└───────────────
`;
}