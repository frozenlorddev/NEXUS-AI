const axios = require("axios");

module.exports = {
  command: ["emojimix", "emix"],
  desc: "Mix two emojis together",
  category: "Utility",
  usage: ".emojimix 😀+🔥",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .emojimix 😀+🔥\nExample: .emojimix 😂+❤️");
    const input = args.join("").replace(/\s+/g, "");
    const emojis = input.split("+").filter(Boolean);
    if (emojis.length < 2) return xreply("❌ Provide two emojis separated by +\nExample: .emojimix 😂+🔥");
    const e1 = emojis[0], e2 = emojis[1];
    const getCodepoint = (e) => [...e].map(c => c.codePointAt(0).toString(16)).join("-");
    const c1 = getCodepoint(e1), c2 = getCodepoint(e2);
    const date = "20230301";
    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/${date}/u${c1}/u${c1}_u${c2}.png`;
    try {
      await trashcore.sendMessage(chat, {
        image: { url },
        caption: `✨ Emoji Mix: ${e1} + ${e2}`
      }, { quoted: m });
    } catch {
      await xreply("❌ This emoji combination isn't available. Try different emojis!");
    }
  }
};
