module.exports = {
  command: ["setgname", "rename"],
  desc: "Change the group name",
  category: "Group",
  usage: ".setgname <new name>",
  run: async ({ trashcore, chat, args, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    if (!args.length) return xreply("❌ Usage: .setgname <new name>");
    const name = args.join(" ");
    try {
      await trashcore.groupUpdateSubject(chat, name);
      return xreply(`✅ Group name updated to: *${name}*`);
    } catch {
      return xreply("❌ Failed to update group name. Ensure the bot is an admin.");
    }
  }
};
