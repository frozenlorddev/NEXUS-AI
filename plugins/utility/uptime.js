module.exports = {
  command: ["uptime", "runtime"],
  desc: "Check how long the bot has been running",
  category: "Utility",
  usage: ".uptime",
  run: async ({ xreply }) => {
    const ms = Date.now() - (global.botStartTime || Date.now());
    const s  = Math.floor(ms / 1000);
    const d  = Math.floor(s / 86400);
    const h  = Math.floor((s % 86400) / 3600);
    const m  = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(`${d} day${d > 1 ? "s" : ""}`);
    if (h) parts.push(`${h} hour${h > 1 ? "s" : ""}`);
    if (m) parts.push(`${m} minute${m > 1 ? "s" : ""}`);
    parts.push(`${sec} second${sec !== 1 ? "s" : ""}`);
    return xreply(`⏱️ *Bot Uptime*\n\n${parts.join(", ")}`);
  }
};
