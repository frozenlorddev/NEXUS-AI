const { getSetting, setSetting } = require("../../database");

module.exports = {
  command: ["antilink"],
  desc: "Toggle anti-link protection in group (deletes messages with links)",
  category: "Group",
  usage: ".antilink <on|off>",
  run: async ({ trashcore, chat, args, isOwner, botNumber, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    const sub = args[0]?.toLowerCase();
    if (!sub || !["on", "off"].includes(sub))
      return xreply("❌ Usage: .antilink on | .antilink off");
    const enabled = sub === "on";
    setSetting(botNumber, `antilink_${chat}`, enabled);
    return xreply(enabled
      ? "🛡️ Anti-link is now *ON*. Any messages with links from non-admins will be deleted."
      : "🛡️ Anti-link is now *OFF*.");
  }
};
