const axios = require("axios");

module.exports = {
  command: ["roast"],
  desc: "Roast someone with AI (just for fun!)",
  category: "AI",
  usage: ".roast <name or @mention>",
  run: async ({ args, m, xreply }) => {
    const target =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]?.split("@")[0] ||
      args.join(" ") ||
      "yourself";
    try {
      const { data } = await axios.get(
        `https://api.ootaizumi.web.id/ai/gpt?prompt=${encodeURIComponent(`Give me one short funny roast for someone named ${target}. Keep it playful and not offensive. Max 2 sentences.`)}`,
        { timeout: 20000 }
      );
      const roast = data?.result || data?.response || "You're so forgettable that even your shadow pretends it doesn't know you.";
      return xreply(`🔥 *Roast for ${target}*\n\n${roast}`);
    } catch {
      const roasts = [
        "You're so slow, you'd lose a race to a parked car.",
        "If brains were taxed, you'd get a refund.",
        "You're the reason the gene pool needs a lifeguard.",
        "I'd roast you harder but my mama told me not to burn trash.",
      ];
      return xreply(`🔥 *Roast for ${target}*\n\n${roasts[Math.floor(Math.random() * roasts.length)]}`);
    }
  }
};
