const axios = require("axios");

module.exports = {
  command: ["aiimage", "aiart", "drawme"],
  desc: "Generate an AI image from a text prompt",
  category: "Fun",
  usage: ".imagine <prompt>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("🎨 Usage: .imagine <description>\nExample: .imagine a beautiful sunset over mountains");
    const prompt = args.join(" ");
    await xreply(`🎨 _Generating AI image for: "${prompt}"..._`);
    try {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
      const { data } = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
      await trashcore.sendMessage(chat, {
        image: Buffer.from(data),
        caption: `🎨 *AI Generated Image*\n\n📝 Prompt: "${prompt}"`
      }, { quoted: m });
    } catch {
      await xreply("❌ Failed to generate image. Please try again with a different prompt.");
    }
  }
};
