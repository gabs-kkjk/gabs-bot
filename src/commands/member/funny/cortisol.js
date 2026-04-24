import path from "path"
import { PREFIX } from "../../../config.js"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {

  name: "cortisol",
  description: "mede seu nível de cortisol",
  commands: ["cortisol"],
  usage: `${PREFIX}cortisol`,

  handle: async ({ sendReply, sendImageFromFile }) => {

    const level = Math.floor(Math.random() * 5) + 1

    const meter = ["🟩","🟨","🟧","🟥","⚠️"]
    const highlight = ["🟢","🟡","🟠","🛑","☢️"]

    const meterDisplay = meter.map((emoji, i) =>
      i === level - 1 ? highlight[i] : emoji
    ).join(" ")

    const texts = {
      1: "🧘 Baixo — zen total",
      2: "🙂 Baixo → médio — tranquilo",
      3: "😐 Médio — começando a tiltar",
      4: "😤 Médio → alto — estresse batendo",
      5: "💀 ALTO — cortisol nas alturas"
    }

    // scanner fake
    await sendReply("🧪 *Analisando cortisol...*\n▰▱▱▱▱▱▱▱▱")
    await sleep(700)

    await sendReply("🧪 *Analisando cortisol...*\n▰▰▰▱▱▱▱▱▱")
    await sleep(700)

    await sendReply("🧪 *Analisando cortisol...*\n▰▰▰▰▰▰▱▱▱")
    await sleep(700)

    const imagePath = path.resolve(`./assets/images/cortisol${level}.jpg`)

    const caption =
`🧪 *MEDIDOR DE CORTISOL*

${meterDisplay}

${texts[level]}

📊 Resultado: *${level}/5*`

    await sendImageFromFile(imagePath, caption)

  }

}
