const { getWallet } = require("../../database");

module.exports = {
  command: ["deposit", "withdraw", "bank"],
  desc: "Deposit or withdraw coins from your bank",
  category: "Economy",
  usage: ".deposit <amount|all> | .withdraw <amount|all>",
  run: async ({ command, args, sender, xreply }) => {
    if (command === "bank") {
      const w = getWallet(sender);
      return xreply(`🏦 *Bank — @${sender}*\n\n👛 Pocket: *${w.coins.toLocaleString()} coins*\n🏦 Bank: *${w.bank.toLocaleString()} coins*\n\nUse .deposit or .withdraw`);
    }
    if (!args.length) return xreply(`❌ Usage: .${command} <amount|all>`);
    const w = getWallet(sender);
    const { db } = require("../../database");
    if (command === "deposit") {
      const amount = args[0] === "all" ? w.coins : parseInt(args[0]);
      if (isNaN(amount) || amount < 1) return xreply("❌ Invalid amount.");
      if (amount > w.coins) return xreply(`❌ Not enough in pocket! You have *${w.coins}* coins.`);
      db.prepare("UPDATE economy SET coins=coins-?, bank=bank+? WHERE user_id=?").run(amount, amount, sender);
      return xreply(`🏦 *Deposited ${amount.toLocaleString()} coins* to bank.\n👛 Pocket: ${getWallet(sender).coins.toLocaleString()} | 🏦 Bank: ${getWallet(sender).bank.toLocaleString()}`);
    } else {
      const amount = args[0] === "all" ? w.bank : parseInt(args[0]);
      if (isNaN(amount) || amount < 1) return xreply("❌ Invalid amount.");
      if (amount > w.bank) return xreply(`❌ Not enough in bank! You have *${w.bank}* in bank.`);
      db.prepare("UPDATE economy SET coins=coins+?, bank=bank-? WHERE user_id=?").run(amount, amount, sender);
      return xreply(`🏦 *Withdrew ${amount.toLocaleString()} coins* from bank.\n👛 Pocket: ${getWallet(sender).coins.toLocaleString()} | 🏦 Bank: ${getWallet(sender).bank.toLocaleString()}`);
    }
  }
};
