const axios = require("axios");

module.exports = {
  command: ["gpt", "chatgpt", "ai"],
  desc: "Chat with GPT AI",
  category: "AI",
  usage: ".gpt <question>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("🤖 Usage: .gpt <question>\nExample: .gpt What is quantum computing?");
    const prompt = args.join(" ");
    await xreply("🤖 Thinking...");
    try {
      const { data } = await axios.get(
        `https://api.ootaizumi.web.id/ai/gpt?prompt=${encodeURIComponent(prompt)}`,
        { timeout: 30000 }
      );
      const result = data?.result || data?.response || data?.text || data?.answer;
      if (!result) throw new Error("No result");
      await trashcore.sendMessage(chat, { text: `🤖 *GPT Response*\n\n${result}` }, { quoted: m });
    } catch {
      try {
        const { data } = await axios.get(
          `https://api.nekorinn.my.id/ai/chatgpt4?text=${encodeURIComponent(prompt)}`,
          { timeout: 30000 }
        );
        const result = data?.result || data?.response;
        if (!result) throw new Error("No result");
        await trashcore.sendMessage(chat, { text: `🤖 *GPT Response*\n\n${result}` }, { quoted: m });
      } catch {
        await xreply("❌ AI is currently unavailable. Please try again later.");
      }
    }
  }
};
