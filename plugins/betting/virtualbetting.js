const { getWallet } = require("../../database");

const VIRTUAL_MATCHES = [
  { home: "CyberByte FC", away: "Bot United", h: 1.85, d: 3.20, a: 4.50 },
  { home: "Pixel Stars", away: "Digital Rovers", h: 2.10, d: 3.00, a: 3.60 },
  { home: "Code Warriors", away: "Data City", h: 1.70, d: 3.40, a: 5.00 },
  { home: "Crypto Athletic", away: "Blockchain FC", h: 2.50, d: 3.10, a: 2.90 },
  { home: "Neon Knights", away: "Matrix United", h: 1.60, d: 3.50, a: 6.00 },
];

module.exports = {
  command: ["virtual", "vbet", "vsoccer"],
  desc: "Bet on virtual football matches",
  category: "Betting",
  usage: ".virtual — see matches | .vbet <match#> <H|D|A> <stake>",
  run: async ({ command, args, sender, xreply }) => {
    const { db } = require("../../database");
    if (command === "virtual" || !args.length) {
      let text = "⚽ *Virtual Football Betting*\n━━━━━━━━━━━━━━━━━\n\n";
      VIRTUAL_MATCHES.forEach((m, i) => {
        text += `*${i+1}.* ${m.home} vs ${m.away}\n`;
        text += `  🏠 H: ${m.h} | 🤝 D: ${m.d} | ✈️ A: ${m.a}\n\n`;
      });
      text += `_Bet: .vbet <match#> <H/D/A> <stake>_\n_Example: .vbet 1 H 100_`;
      return xreply(text);
    }
    const matchNum = parseInt(args[0]) - 1;
    const pick = args[1]?.toUpperCase();
    const stake = parseInt(args[2]);
    if (isNaN(matchNum) || matchNum < 0 || matchNum >= VIRTUAL_MATCHES.length) return xreply("❌ Invalid match number.");
    if (!["H","D","A"].includes(pick)) return xreply("❌ Pick must be H (Home), D (Draw), or A (Away).");
    if (isNaN(stake) || stake < 10) return xreply("❌ Minimum stake: 10 coins.");
    const w = getWallet(sender);
    if (stake > w.coins) return xreply(`❌ Not enough coins! You have ${w.coins.toLocaleString()}.`);
    const match = VIRTUAL_MATCHES[matchNum];
    const odds = pick === "H" ? match.h : pick === "D" ? match.d : match.a;
    const rand = Math.random();
    const homeProb = 1 / match.h, drawProb = 1 / match.d;
    let outcome;
    if (rand < homeProb * 0.85) outcome = "H";
    else if (rand < homeProb * 0.85 + drawProb * 0.85) outcome = "D";
    else outcome = "A";
    const outcomeStr = outcome === "H" ? `${match.home} WIN` : outcome === "D" ? "DRAW" : `${match.away} WIN`;
    if (outcome === pick) {
      const winnings = Math.floor(stake * odds);
      db.prepare("UPDATE economy SET coins=coins+? WHERE user_id=?").run(winnings - stake, sender);
      return xreply(`⚽ *${match.home} vs ${match.away}*\n\n🏆 Result: *${outcomeStr}*\n\n✅ *YOU WON!*\n💸 Stake: ${stake} | 📈 Odds: ${odds}x\n💰 Profit: *+${winnings - stake} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
    }
    db.prepare("UPDATE economy SET coins=coins-? WHERE user_id=?").run(stake, sender);
    return xreply(`⚽ *${match.home} vs ${match.away}*\n\n🏆 Result: *${outcomeStr}*\n\n❌ *You Lost*\n💸 Lost: -${stake} coins\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
  }
};
