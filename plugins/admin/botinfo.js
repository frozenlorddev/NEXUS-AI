const { getSetting } = require("../../database");
const { plugins } = require("../../pluginStore");
const os = require("os");

module.exports = {
  command: ["botinfo", "info", "sysinfo"],
  desc: "Show detailed bot and system information",
  category: "Owner",
  usage: ".botinfo",
  run: async ({ trashcore, chat, botNumber, xreply }) => {
    const ms = Date.now() - (global.botStartTime || Date.now());
    const s  = Math.floor(ms / 1000);
    const uptime = `${Math.floor(s/86400)}d ${Math.floor((s%86400)/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s`;
    const prefix = getSetting(botNumber, "prefix", ".");
    const mode   = getSetting(botNumber, "privateMode", false) ? "Private" : "Public";
    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const memTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const cpuLoad = os.loadavg()[0].toFixed(2);
    const text =
      `╔══════════════════════╗\n` +
      `   🤖 CYBERBYTE AI BOT INFO\n` +
      `╚══════════════════════╝\n\n` +
      `🔑 Prefix: ${prefix}\n` +
      `⚙️ Mode: ${mode}\n` +
      `🧩 Plugins: ${plugins.size}\n` +
      `⏳ Uptime: ${uptime}\n\n` +
      `💻 System Info\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🖥️ OS: ${os.type()} ${os.release()}\n` +
      `⚡ CPU Load: ${cpuLoad}\n` +
      `🧠 Memory: ${memUsed} MB used\n` +
      `💾 Total RAM: ${memTotal} GB\n` +
      `📦 Node.js: ${process.version}\n` +
      `🤖 Bot Number: ${botNumber}\n`;
    await trashcore.sendMessage(chat, { text });
  }
};
