module.exports = {
  command: ["lovemeter", "lovetest", "compatibility"],
  desc: "Check love compatibility between two names",
  category: "Fun",
  usage: ".lovemeter <name1> and <name2>",
  run: async ({ args, text, m, xreply }) => {
    let n1, n2;
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length >= 2) {
      n1 = mentioned[0].split("@")[0]; n2 = mentioned[1].split("@")[0];
    } else if (text && text.toLowerCase().includes(" and ")) {
      [n1, n2] = text.split(/ and /i).map(s => s.trim());
    } else {
      n1 = args[0]; n2 = args[1];
    }
    if (!n1 || !n2) return xreply("❌ Usage: .lovemeter <name1> and <name2>\nor mention two people");
    const seed = [...(n1 + n2).toLowerCase()].reduce((a, c) => a + c.charCodeAt(0), 0);
    const pct = (seed % 41) + 60;
    const bar = "❤️".repeat(Math.round(pct / 10)) + "🖤".repeat(10 - Math.round(pct / 10));
    let emoji, msg;
    if (pct >= 90) { emoji = "💑"; msg = "Soulmates! Perfect match!"; }
    else if (pct >= 75) { emoji = "💕"; msg = "Great couple! Strong chemistry."; }
    else if (pct >= 60) { emoji = "💘"; msg = "Good compatibility. Worth exploring!"; }
    else { emoji = "💔"; msg = "Might need some work..."; }
    return xreply(`${emoji} *Love Meter*\n\n❤️ ${n1} & ${n2}\n\n${bar}\n\n💯 *${pct}%* — ${msg}`);
  }
};
