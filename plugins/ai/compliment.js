module.exports = {
  command: ["compliment", "praise"],
  desc: "Send a compliment to someone",
  category: "AI",
  usage: ".compliment @mention or .compliment name",
  run: async ({ args, m, xreply }) => {
    const target =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]?.split("@")[0] ||
      args.join(" ") ||
      "you";
    const compliments = [
      "is an absolute legend! The world is brighter because of you. 🌟",
      "is incredibly talented and brings joy to everyone around them! 💫",
      "has the most amazing energy — your smile lights up any room! ☀️",
      "is one of the most genuine and kind people I know! 💜",
      "is a rockstar! Your dedication and hard work are truly inspiring! 🚀",
      "makes everything better just by being there! 🌈",
      "is smarter than they give themselves credit for! 🧠✨",
      "has a heart of gold and the courage to match! 🦁❤️",
    ];
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    return xreply(`💝 *Compliment*\n\n@${target} ${compliment}`);
  }
};
