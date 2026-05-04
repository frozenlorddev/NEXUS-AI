const spamTracker = new Map();

module.exports = {
  command: ["antispam", "spamguard"],
  desc: "Toggle anti-spam protection in the group",
  category: "Group",
  usage: ".antispam on|off",
  isAdmin: true,
  run: async ({ args, chat, phone, isOwner, xreply, setSetting }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ Group only.");
    if (!isOwner) return xreply("❌ Only bot owner can toggle antispam.");
    const status = args[0]?.toLowerCase();
    if (!["on","off"].includes(status)) return xreply("❌ Usage: .antispam on|off");
    setSetting(phone, `antispam_${chat}`, status === "on");
    return xreply(`🛡️ *Anti-Spam ${status === "on" ? "Enabled ✅" : "Disabled ❌"}*\n\n${status === "on" ? "Users sending more than 5 messages in 5 seconds will be warned." : "Spam protection is now off."}`);
  }
};
