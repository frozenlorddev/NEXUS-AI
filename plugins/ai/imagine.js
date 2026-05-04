const axios = require("axios");

module.exports = {
  command: ["imagine", "txt2img", "generate"],
  desc: "Generate an AI image from a text prompt",
  category: "AI",
  usage: ".imagine <description>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length)
      return xreply("🎨 Usage: .imagine <description>\nExample: .imagine a futuristic city at night");
    const prompt = args.join(" ");
    await xreply("🎨 Generating image, please wait...");
    try {
      const urls = [
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`,
      ];
      await trashcore.sendMessage(chat, {
        image: { url: urls[0] },
        caption: `🎨 *AI Generated Image*\n\n📝 Prompt: ${prompt}`
      }, { quoted: m });
    } catch {
      await xreply("❌ Failed to generate image. Try a different prompt.");
    }
  }
};
