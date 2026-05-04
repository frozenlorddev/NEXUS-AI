const { getWallet } = require("../../database");

module.exports = {
  command: ["transfer", "give", "pay", "send"],
  desc: "Transfer coins to another user",
  category: "Economy",
  usage: ".transfer @user <amount>",
  run: async ({ m, args, sender, xreply }) => {
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!target) return xreply("❌ Usage: .transfer @user <amount>\nMention the person to transfer to.");
    const amount = parseInt(args[1] || args[0]);
    if (isNaN(amount) || amount < 1) return xreply("❌ Invalid amount.");
    const senderNum = sender;
    const targetNum = target.split("@")[0];
    if (senderNum === targetNum) return xreply("❌ You can't transfer to yourself.");
    const w = getWallet(senderNum);
    if (amount > w.coins) return xreply(`❌ Not enough coins! You have *${w.coins.toLocaleString()}* coins.`);
    const { db } = require("../../database");
    db.prepare("UPDATE economy SET coins=coins-? WHERE user_id=?").run(amount, senderNum);
    db.prepare("INSERT OR IGNORE INTO economy (user_id) VALUES (?)").run(targetNum);
    db.prepare("UPDATE economy SET coins=coins+? WHERE user_id=?").run(amount, targetNum);
    return xreply(
      `✅ *Transfer Complete!*\n\n` +
      `💸 Sent: *${amount.toLocaleString()} coins* to @${targetNum}\n` +
      `👛 Your balance: ${getWallet(senderNum).coins.toLocaleString()} coins`,
      { mentions: [target] }
    );
  }
};
