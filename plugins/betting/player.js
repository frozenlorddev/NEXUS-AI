const axios = require("axios");

module.exports = {
  command: ["player", "footballer"],
  desc: "Get football player information",
  category: "Betting",
  usage: ".player <player name>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .player <name>\nExample: .player Messi");
    const query = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`,
        { timeout: 10000 }
      );
      const p = data?.player?.[0];
      if (!p) return xreply(`❌ Player "${query}" not found.`);
      const text =
        `👤 *${p.strPlayer}*\n` +
        `🏟️ Team: ${p.strTeam || "N/A"}\n` +
        `🌍 Nationality: ${p.strNationality || "N/A"}\n` +
        `📅 Born: ${p.dateBorn || "N/A"}\n` +
        `⚽ Position: ${p.strPosition || "N/A"}\n` +
        `👕 Number: ${p.strNumber || "N/A"}\n` +
        `📏 Height: ${p.strHeight || "N/A"}\n` +
        `⚖️ Weight: ${p.strWeight || "N/A"}\n\n` +
        `${(p.strDescriptionEN || "").slice(0, 250)}${p.strDescriptionEN?.length > 250 ? "..." : ""}`;
      if (p.strThumb || p.strCutout) {
        await trashcore.sendMessage(chat, { image: { url: p.strThumb || p.strCutout }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      return xreply("❌ Failed to fetch player info.");
    }
  }
};
