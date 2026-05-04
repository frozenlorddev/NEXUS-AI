const axios = require("axios");

module.exports = {
  command: ["gemini", "gem"],
  desc: "Chat with Google Gemini AI",
  category: "AI",
  usage: ".gemini <question>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("🧠 Usage: .gemini <question>\nExample: .gemini Explain black holes");
    const prompt = args.join(" ");
    await xreply("🧠 Asking Gemini...");
    try {
      const { data } = await axios.get(
        `https://api.ootaizumi.web.id/ai/gemini?prompt=${encodeURIComponent(prompt)}`,
        { timeout: 30000 }
      );
      const result = data?.result || data?.response || data?.text;
      if (!result) throw new Error("No result");
      await trashcore.sendMessage(chat, { text: `🧠 *Gemini Response*\n\n${result}` }, { quoted: m });
    } catch {
      await xreply("❌ Gemini is currently unavailable. Please try again later.");
    }
  }
};
