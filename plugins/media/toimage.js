const { downloadContentFromMessage } = require("@trashcore/baileys");

module.exports = {
  command: ["toimage", "stickertoimg", "s2img"],
  desc: "Convert a sticker to an image",
  category: "Media",
  usage: ".toimage (reply to a sticker)",
  run: async ({ trashcore, m, chat, xreply }) => {
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const msg = (quotedMsg && quotedMsg.stickerMessage) || m.message?.stickerMessage;
    if (!msg) return xreply("⚠️ Reply to a *sticker* with .toimage");
    try {
      await xreply("🖼️ Converting sticker to image...");
      const stream = await downloadContentFromMessage(msg, "sticker");
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      await trashcore.sendMessage(chat, {
        image: buffer,
        mimetype: "image/webp",
        caption: "✅ Here is your image!"
      }, { quoted: m });
    } catch {
      await xreply("❌ Failed to convert sticker. Please try again.");
    }
  }
};
