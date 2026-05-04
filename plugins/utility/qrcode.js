const axios = require("axios");

module.exports = {
  command: ["qr", "qrcode", "genqr"],
  desc: "Generate a QR code for any text or URL",
  category: "Utility",
  usage: ".qr <text or URL>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .qr <text or URL>\nExample: .qr https://google.com");
    const text = args.join(" ");
    try {
      const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
      await trashcore.sendMessage(chat, {
        image: { url: imageUrl },
        caption: `📱 *QR Code*\n\n📝 Content: ${text.slice(0, 100)}${text.length > 100 ? "..." : ""}`
      }, { quoted: m });
    } catch {
      await xreply("❌ Failed to generate QR code. Please try again.");
    }
  }
};
