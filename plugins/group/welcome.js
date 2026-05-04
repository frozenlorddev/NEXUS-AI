const { getSetting, setSetting } = require("../../database");

module.exports = {
  command: ["welcome"],
  desc: "Toggle welcome messages for new members",
  category: "Group",
  usage: ".welcome <on|off> [custom message]",
  run: async ({ args, chat, isOwner, botNumber, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    const sub = args[0]?.toLowerCase();
    if (!sub || !["on", "off"].includes(sub))
      return xreply("❌ Usage: .welcome on [msg] | .welcome off\n\nUse {name} as placeholder for new member's name.");
    const enabled = sub === "on";
    setSetting(botNumber, `welcome_${chat}`, enabled);
    if (enabled && args.length > 1) {
      setSetting(botNumber, `welcome_msg_${chat}`, args.slice(1).join(" "));
    }
    return xreply(enabled
      ? "👋 Welcome messages are *ON*.\nNew members will be greeted automatically."
      : "👋 Welcome messages are *OFF*.");
  }
};
