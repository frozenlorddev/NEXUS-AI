module.exports = {
  command: ["mute", "unmute"],
  desc: "Mute or unmute a group (restrict/unrestrict members from sending messages)",
  category: "Group",
  usage: ".mute | .unmute",
  run: async ({ trashcore, chat, command, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    try {
      const setting = command === "mute" ? "announcement" : "not_announcement";
      await trashcore.groupSettingUpdate(chat, setting);
      return xreply(command === "mute"
        ? "🔇 Group muted. Only admins can send messages now."
        : "🔊 Group unmuted. Everyone can send messages now."
      );
    } catch {
      return xreply("❌ Failed. Make sure the bot is a group admin.");
    }
  }
};
