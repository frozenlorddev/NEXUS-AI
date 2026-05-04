module.exports = {
  command: ["leave", "leavegroup"],
  desc: "Make the bot leave the group (owner only)",
  category: "Group",
  usage: ".leave",
  run: async ({ trashcore, chat, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    await xreply("👋 Goodbye! Bot is leaving the group...");
    try {
      await trashcore.groupLeave(chat);
    } catch {
      await xreply("❌ Failed to leave the group.");
    }
  }
};
