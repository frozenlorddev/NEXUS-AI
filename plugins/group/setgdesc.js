module.exports = {
  command: ["setgdesc", "desc"],
  desc: "Change the group description",
  category: "Group",
  usage: ".setgdesc <new description>",
  run: async ({ trashcore, chat, args, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    if (!args.length) return xreply("❌ Usage: .setgdesc <new description>");
    const desc = args.join(" ");
    try {
      await trashcore.groupUpdateDescription(chat, desc);
      return xreply(`✅ Group description updated.`);
    } catch {
      return xreply("❌ Failed to update group description. Ensure the bot is an admin.");
    }
  }
};
