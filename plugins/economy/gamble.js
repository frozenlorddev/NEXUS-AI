const { getWallet } = require("../../database");

module.exports = {
  command: ["gamble", "bet"],
  desc: "Gamble your coins (50% chance to double)",
  category: "Economy",
  usage: ".gamble <amount|all|half>",
  run: async ({ sender, args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .gamble <amount|all|half>\nExample: .gamble 100");
    const w = getWallet(sender);
    let amount;
    if (args[0] === "all") amount = w.coins;
    else if (args[0] === "half") amount = Math.floor(w.coins / 2);
    else amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1) return xreply("❌ Invalid amount.");
    if (amount > w.coins) return xreply(`❌ Not enough coins! You have *${w.coins.toLocaleString()}* coins.`);
    const { db } = require("../../database");
    const win = Math.random() < 0.5;
    if (win) {
      const winnings = Math.floor(amount * (1.5 + Math.random() * 0.5));
      db.prepare("UPDATE economy SET coins=coins+?, total_won=total_won+? WHERE user_id=?").run(winnings, winnings, sender);
      return xreply(
        `🎰 *You Won!* 🎉\n\n` +
        `💸 Bet: ${amount.toLocaleString()} coins\n` +
        `💰 Won: *+${winnings.toLocaleString()} coins*\n\n` +
        `👛 Balance: ${getWallet(sender).coins.toLocaleString()} coins`
      );
    } else {
      db.prepare("UPDATE economy SET coins=coins-?, total_lost=total_lost+? WHERE user_id=?").run(amount, amount, sender);
      return xreply(
        `🎰 *You Lost!* 😢\n\n` +
        `💸 Lost: *-${amount.toLocaleString()} coins*\n\n` +
        `👛 Balance: ${getWallet(sender).coins.toLocaleString()} coins`
      );
    }
  }
};
