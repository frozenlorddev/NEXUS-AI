module.exports = {
  command: ["lock", "unlock"],
  desc: "Lock or unlock group settings (only admins can edit group info)",
  category: "Group",
  usage: ".lock | .unlock",
  run: async ({ trashcore, chat, command, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    try {
      const setting = command === "lock" ? "locked" : "unlocked";
      await trashcore.groupSettingUpdate(chat, setting);
      return xreply(command === "lock"
        ? "🔒 Group locked. Only admins can edit group info."
        : "🔓 Group unlocked. All members can edit group info."
      );
    } catch {
      return xreply("❌ Failed. Make sure the bot is a group admin.");
    }
  }
};
