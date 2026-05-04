const { getWallet, addCoins } = require("../../database");

module.exports = {
  command: ["weekly"],
  desc: "Claim your weekly coins bonus",
  category: "Economy",
  usage: ".weekly",
  run: async ({ sender, xreply }) => {
    const w = getWallet(sender);
    const now = Date.now();
    const cooldown = 7 * 24 * 60 * 60 * 1000;
    if (w.weekly_claimed && now - w.weekly_claimed < cooldown) {
      const remaining = cooldown - (now - w.weekly_claimed);
      const d = Math.floor(remaining / 86400000);
      const h = Math.floor((remaining % 86400000) / 3600000);
      return xreply(`⏳ Already claimed weekly! Come back in *${d}d ${h}h*`);
    }
    const amount = Math.floor(Math.random() * 3000) + 3000;
    const { db: database } = require("../../database");
    database.prepare("UPDATE economy SET coins=coins+?, weekly_claimed=? WHERE user_id=?").run(amount, now, sender);
    return xreply(
      `🎉 *Weekly Bonus Claimed!*\n\n` +
      `💰 Reward: *+${amount.toLocaleString()} coins*\n` +
      `👛 Balance: ${getWallet(sender).coins.toLocaleString()} coins\n\n` +
      `_Come back in 7 days for your next weekly!_`
    );
  }
};
