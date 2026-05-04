const { getWallet } = require("../../database");

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣", "🍀", "🎰"];
const PAYOUTS = { "💎💎💎": 10, "7️⃣7️⃣7️⃣": 8, "🍀🍀🍀": 6, "⭐⭐⭐": 5, "🔔🔔🔔": 4, "🍒🍒🍒": 3, "🍋🍋🍋": 3, "🎰🎰🎰": 15 };

module.exports = {
  command: ["slots", "slot", "spin"],
  desc: "Spin the slot machine to win coins",
  category: "Economy",
  usage: ".slots <amount>",
  run: async ({ sender, args, xreply }) => {
    if (!args.length) return xreply("🎰 Usage: .slots <amount>\nExample: .slots 50");
    const w = getWallet(sender);
    let amount;
    if (args[0] === "all") amount = w.coins;
    else if (args[0] === "max") amount = Math.min(w.coins, 1000);
    else amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 10) return xreply("❌ Minimum bet is 10 coins.");
    if (amount > w.coins) return xreply(`❌ Not enough coins! You have *${w.coins.toLocaleString()}* coins.`);

    const spin = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const r = [spin(), spin(), spin()];
    const line = r.join(" | ");
    const key = r.join("");
    const { db } = require("../../database");

    const payoutKey = Object.keys(PAYOUTS).find(k => k === key);
    if (payoutKey) {
      const mult = PAYOUTS[payoutKey];
      const won = amount * mult;
      db.prepare("UPDATE economy SET coins=coins+?, total_won=total_won+? WHERE user_id=?").run(won - amount, won - amount, sender);
      return xreply(`🎰 [ ${line} ]\n\n🎉 *JACKPOT! x${mult}!*\n💰 Won: *+${(won - amount).toLocaleString()} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
    }
    if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
      const won = Math.floor(amount * 1.5);
      db.prepare("UPDATE economy SET coins=coins+?, total_won=total_won+? WHERE user_id=?").run(won - amount, won - amount, sender);
      return xreply(`🎰 [ ${line} ]\n\n✅ *Two of a kind! x1.5*\n💰 Won: *+${(won - amount).toLocaleString()} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
    }
    db.prepare("UPDATE economy SET coins=coins-?, total_lost=total_lost+? WHERE user_id=?").run(amount, amount, sender);
    return xreply(`🎰 [ ${line} ]\n\n😢 *No match. Better luck next time!*\n💸 Lost: *-${amount.toLocaleString()} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
  }
};
