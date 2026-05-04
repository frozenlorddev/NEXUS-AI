const { getSetting, setSetting } = require("../../database");

module.exports = {
  command: ["goodbye", "bye"],
  desc: "Toggle goodbye messages for members who leave",
  category: "Group",
  usage: ".goodbye <on|off>",
  run: async ({ args, chat, isOwner, botNumber, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    const sub = args[0]?.toLowerCase();
    if (!sub || !["on", "off"].includes(sub))
      return xreply("❌ Usage: .goodbye on | .goodbye off");
    const enabled = sub === "on";
    setSetting(botNumber, `goodbye_${chat}`, enabled);
    return xreply(enabled
      ? "👋 Goodbye messages are *ON*.\nMembers who leave will get a farewell message."
      : "👋 Goodbye messages are *OFF*.");
  }
};
