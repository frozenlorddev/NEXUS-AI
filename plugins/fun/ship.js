module.exports = {
  command: ["ship", "love"],
  desc: "Ship two names and get a love percentage",
  category: "Fun",
  usage: ".ship <name1> + <name2>",
  run: async ({ text, xreply }) => {
    if (!text || !text.includes("+"))
      return xreply("❌ Usage: .ship <name1> + <name2>\nExample: .ship Alice + Bob");
    const parts = text.split("+").map(s => s.trim());
    if (parts.length < 2 || !parts[0] || !parts[1])
      return xreply("❌ Usage: .ship <name1> + <name2>");
    const pct = Math.floor(Math.random() * 101);
    const bar = "❤️".repeat(Math.floor(pct / 10)) + "🖤".repeat(10 - Math.floor(pct / 10));
    let mood = pct >= 80 ? "💞 Soulmates!" : pct >= 60 ? "💕 Great match!" : pct >= 40 ? "💛 Could work..." : pct >= 20 ? "💔 Needs effort" : "😬 Not a match";
    return xreply(`💘 *Ship Meter*\n\n${parts[0]} ❤️ ${parts[1]}\n\n${bar}\n\n*${pct}%* — ${mood}`);
  }
};
