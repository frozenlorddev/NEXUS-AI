module.exports = {
  command: ["setname", "botnick"],
  desc: "Change the bot's display name (owner only)",
  category: "Owner",
  usage: ".setname <new name>",
  isOwner: true,
  run: async ({ trashcore, args, isOwner, xreply }) => {
    if (!isOwner) return xreply("❌ Only the bot owner can use this command.");
    if (!args.length) return xreply("❌ Usage: .setname <new name>");
    const name = args.join(" ");
    try {
      await trashcore.updateProfileName(name);
      return xreply(`✅ Bot name updated to: *${name}*`);
    } catch {
      return xreply("❌ Failed to update bot name.");
    }
  }
};
