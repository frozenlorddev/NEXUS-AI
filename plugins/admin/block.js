module.exports = {
  command: ["block", "unblock"],
  desc: "Block or unblock a WhatsApp contact",
  category: "Owner",
  usage: ".block @user | .unblock @user",
  isOwner: true,
  run: async ({ trashcore, m, args, command, isOwner, xreply }) => {
    if (!isOwner) return xreply("❌ Only the bot owner can use this command.");
    let target =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0] && `${args[0].replace(/\D/g, "")}@s.whatsapp.net`);
    if (!target) return xreply(`❌ Usage: .${command} @user or reply to someone`);
    try {
      const action = command === "block" ? "block" : "unblock";
      await trashcore.updateBlockStatus(target, action);
      const num = target.split("@")[0];
      return xreply(command === "block"
        ? `🚫 Blocked @${num} successfully.`
        : `✅ Unblocked @${num} successfully.`,
        { mentions: [target] }
      );
    } catch {
      return xreply(`❌ Failed to ${command} this user.`);
    }
  }
};
