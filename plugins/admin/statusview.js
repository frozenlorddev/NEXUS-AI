const { getSetting, setSetting } = require("../../database");

module.exports = {
  command: ["statusview", "statusvw"],
  desc: "Toggle automatic status viewing (owner only)",
  category: "Owner",
  run: async ({ m, args, xreply, isOwner, botNumber }) => {
    if (!isOwner) return xreply("❌ Only the bot owner can use this command.");

    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
      return xreply("ℹ️ Usage: .statusview on/off\nExample: .statusview off");
    }

    const newValue = args[0].toLowerCase() === "on";
    setSetting(botNumber, "statusView", newValue);

    xreply(`✅ Automatic status view is now: ${newValue ? "ON" : "OFF"}`);
  }
};
