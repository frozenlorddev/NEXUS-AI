const { getWallet } = require("../../database");

module.exports = {
  command: ["balance", "wallet", "coins", "bal", "cash"],
  desc: "Check your coin balance",
  category: "Economy",
  usage: ".balance",
  run: async ({ sender, xreply }) => {
    const w = getWallet(sender);
    const total = w.coins + w.bank;
    return xreply(
      `💰 *Wallet — @${sender}*\n\n` +
      `👛 Pocket: *${w.coins.toLocaleString()} coins*\n` +
      `🏦 Bank:   *${w.bank.toLocaleString()} coins*\n` +
      `💎 Total:  *${total.toLocaleString()} coins*\n\n` +
      `🏆 Won: ${w.total_won.toLocaleString()} | Lost: ${w.total_lost.toLocaleString()}`
    );
  }
};
