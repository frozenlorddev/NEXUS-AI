module.exports = {
  command: ["clearcache", "clearstore"],
  desc: "Clear the bot's message store cache (owner only)",
  category: "Owner",
  usage: ".clearcache",
  isOwner: true,
  run: async ({ isOwner, xreply }) => {
    if (!isOwner) return xreply("❌ Only the bot owner can use this command.");
    try {
      const keys = Object.keys(require.cache);
      let cleared = 0;
      for (const key of keys) {
        if (key.includes("/plugins/") || key.includes("/command")) {
          delete require.cache[key];
          cleared++;
        }
      }
      return xreply(`✅ Cleared ${cleared} cached module(s). Plugins will hot-reload on next use.`);
    } catch (err) {
      return xreply(`❌ Failed to clear cache: ${err.message}`);
    }
  }
};
