const { getWallet } = require("../../database");

const accumulators = new Map();

module.exports = {
  command: ["acca", "accumulator", "multibet"],
  desc: "Build and place an accumulator bet with multiple selections",
  category: "Betting",
  usage: ".acca add <Team A> to beat <Team B> | .acca place <stake> | .acca view | .acca clear",
  run: async ({ sender, args, xreply }) => {
    const { db } = require("../../database");
    const key = sender;
    const sub = args[0]?.toLowerCase();
    if (!accumulators.has(key)) accumulators.set(key, []);
    const slip = accumulators.get(key);

    if (sub === "add") {
      if (args.length < 2) return xreply("❌ Usage: .acca add <Team A> to beat <Team B>\nOr: .acca add draw <Team A> vs <Team B>");
      const selText = args.slice(1).join(" ");
      if (slip.length >= 8) return xreply("❌ Maximum 8 selections per accumulator.");
      const odds = parseFloat((1.5 + Math.random() * 2.5).toFixed(2));
      slip.push({ sel: selText, odds });
      const totalOdds = slip.reduce((a, s) => a * s.odds, 1).toFixed(2);
      return xreply(`✅ *Added to Betslip!*\n\n📋 ${selText}\n📈 Odds: ${odds}\n\n🎯 Total Selections: ${slip.length}\n💯 Total Odds: *${totalOdds}x*\n\nUse .acca place <stake> to bet, or .acca add more!`);
    }

    if (sub === "view") {
      if (!slip.length) return xreply("❌ Your betslip is empty.\nUse .acca add <selection> to add picks.");
      const totalOdds = slip.reduce((a, s) => a * s.odds, 1).toFixed(2);
      const list = slip.map((s, i) => `${i+1}. ${s.sel} (${s.odds}x)`).join("\n");
      return xreply(`📋 *Your Betslip*\n\n${list}\n\n💯 Total Odds: *${totalOdds}x*\n_Use .acca place <stake> to bet!_`);
    }

    if (sub === "clear") {
      accumulators.set(key, []);
      return xreply("🗑️ Betslip cleared!");
    }

    if (sub === "place") {
      if (!slip.length) return xreply("❌ Add selections first with .acca add");
      const stake = parseInt(args[1]);
      if (isNaN(stake) || stake < 10) return xreply("❌ Minimum stake is 10 coins.\nUsage: .acca place <stake>");
      const w = getWallet(sender);
      if (stake > w.coins) return xreply(`❌ Not enough coins! You have *${w.coins.toLocaleString()}* coins.`);
      const totalOdds = slip.reduce((a, s) => a * s.odds, 1);
      const successRate = Math.pow(0.5, slip.length);
      const won = Math.random() < successRate;
      const list = slip.map((s, i) => `${i+1}. ${s.sel} (${s.odds}x)`).join("\n");
      accumulators.set(key, []);
      if (won) {
        const winnings = Math.floor(stake * totalOdds);
        db.prepare("UPDATE economy SET coins=coins+? WHERE user_id=?").run(winnings - stake, sender);
        return xreply(
          `🎰 *ACCUMULATOR WON!* 🎉\n\n${list}\n\n💯 Odds: *${totalOdds.toFixed(2)}x*\n💸 Stake: ${stake}\n💰 Won: *+${(winnings - stake).toLocaleString()} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`
        );
      } else {
        db.prepare("UPDATE economy SET coins=coins-? WHERE user_id=?").run(stake, sender);
        const failIdx = Math.floor(Math.random() * slip.length);
        return xreply(
          `😢 *ACCUMULATOR LOST*\n\n${list}\n\n💥 Failed at: *${slip[failIdx].sel}*\n💸 Lost: *${stake} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`
        );
      }
    }
    return xreply("❌ Usage:\n.acca add <selection>\n.acca view\n.acca place <stake>\n.acca clear");
  }
};
