const axios = require("axios");

module.exports = {
  command: ["tts", "speak"],
  desc: "Convert text to speech",
  category: "Media",
  usage: ".tts <text>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("🔊 Usage: .tts <text>\nExample: .tts Hello world");
    const text = args.join(" ").slice(0, 200);
    await xreply("🔊 Converting text to speech...");
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
      await trashcore.sendMessage(chat, {
        audio: { url },
        mimetype: "audio/mp3",
        ptt: true
      }, { quoted: m });
    } catch {
      await xreply("❌ Text-to-speech failed. Please try again.");
    }
  }
};
