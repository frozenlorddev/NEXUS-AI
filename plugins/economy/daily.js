const { getWallet } = require("../../database");

module.exports = {
  command: ["daily", "claim"],
  desc: "Claim your daily coins reward",
  category: "Economy",
  usage: ".daily",
  run: async ({ sender, xreply }) => {
    const w = getWallet(sender);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    if (w.daily_claimed && now - w.daily_claimed < cooldown) {
      const remaining = cooldown - (now - w.daily_claimed);
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      return xreply(`⏳ Already claimed! Come back in *${h}h ${m}m*`);
    }
    const amount = Math.floor(Math.random() * 500) + 500;
    const streak = (w.streak || 0) + 1;
    const bonus = Math.min(streak * 50, 500);
    const total = amount + bonus;
    const { db } = require("../../database");
    db.prepare("UPDATE economy SET coins=coins+?, daily_claimed=?, streak=? WHERE user_id=?").run(total, now, streak, sender);
    return xreply(
      `✅ *Daily Reward Claimed!*\n\n` +
      `💰 Base: +${amount} coins\n` +
      `🔥 Streak Bonus (Day ${streak}): +${bonus} coins\n` +
      `💎 Total: *+${total} coins*\n\n` +
      `👛 New balance: ${getWallet(sender).coins.toLocaleString()} coins`
    );
  }
};
