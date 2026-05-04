const { getWallet } = require("../../database");

module.exports = {
  command: ["rob", "steal"],
  desc: "Try to rob another user's coins (risky!)",
  category: "Economy",
  usage: ".rob @user",
  run: async ({ m, sender, xreply }) => {
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!target) return xreply("❌ Usage: .rob @user");
    const targetNum = target.split("@")[0];
    if (sender === targetNum) return xreply("❌ You can't rob yourself.");
    const victim = getWallet(targetNum);
    const robber = getWallet(sender);
    if (victim.coins < 100) return xreply(`❌ @${targetNum} is too poor to rob (< 100 coins).`, { mentions: [target] });
    const { db } = require("../../database");
    const success = Math.random() < 0.45;
    if (success) {
      const stolen = Math.floor(victim.coins * (0.1 + Math.random() * 0.2));
      db.prepare("UPDATE economy SET coins=coins-? WHERE user_id=?").run(stolen, targetNum);
      db.prepare("UPDATE economy SET coins=coins+? WHERE user_id=?").run(stolen, sender);
      return xreply(`🦹 *Robbery Successful!*\n\nYou stole *${stolen.toLocaleString()} coins* from @${targetNum}!\n👛 Your balance: ${getWallet(sender).coins.toLocaleString()} coins`, { mentions: [target] });
    } else {
      const fine = Math.min(Math.floor(robber.coins * 0.15), 300);
      db.prepare("UPDATE economy SET coins=MAX(0,coins-?) WHERE user_id=?").run(fine, sender);
      return xreply(`🚔 *Caught!* You failed to rob @${targetNum} and were fined *${fine} coins*.\n👛 Balance: ${getWallet(sender).coins.toLocaleString()} coins`, { mentions: [target] });
    }
  }
};
