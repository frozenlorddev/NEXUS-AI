module.exports = {
  command: ["everyone", "all", "@all"],
  desc: "Mention all members (alias of tagall with optional message)",
  category: "Group",
  usage: ".everyone [message]",
  run: async ({ trashcore, chat, text, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    try {
      const group = await trashcore.groupMetadata(chat);
      const members = group.participants;
      if (!members.length) return xreply("⚠️ No members found.");
      const prefix = text ? `${text}\n\n` : "📢 *Attention everyone!*\n\n";
      const mentions = members.map(p => `@${p.id.split("@")[0]}`).join(" ");
      await trashcore.sendMessage(chat, {
        text: prefix + mentions,
        mentions: members.map(p => p.id)
      });
    } catch {
      return xreply("❌ Failed to mention everyone.");
    }
  }
};
