import fs from "fs";
import path from "path";

const dbPath = path.resolve("database/add-groups.json");

export default {
  name: "add-group",
  commands: ["agp"],
  handle: async ({ remoteJid, socket, key }) => {
    // lê o banco
    const groups = JSON.parse(fs.readFileSync(dbPath));

    if (!groups.includes(remoteJid)) {
      groups.push(remoteJid);
      fs.writeFileSync(dbPath, JSON.stringify(groups, null, 2));
    }

    // apaga a mensagem do comando
    await socket.sendMessage(remoteJid, {
      delete: key
    });
  }
};