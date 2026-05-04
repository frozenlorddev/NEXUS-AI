const axios = require("axios");

module.exports = {
  command: ["teaminfo", "team", "squad"],
  desc: "Get information about a football team",
  category: "Betting",
  usage: ".team <team name>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .team <team name>\nExample: .team Arsenal");
    const query = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`,
        { timeout: 10000 }
      );
      const team = data?.teams?.[0];
      if (!team) return xreply(`❌ Team "${query}" not found.`);
      const text =
        `⚽ *${team.strTeam}*\n` +
        `🏟️ Stadium: ${team.strStadium || "N/A"}\n` +
        `🌍 Country: ${team.strCountry || "N/A"}\n` +
        `📅 Founded: ${team.intFormedYear || "N/A"}\n` +
        `🏆 League: ${team.strLeague || "N/A"}\n` +
        `🎨 Colors: ${team.strKitColour1 || "N/A"}\n` +
        `🌐 Website: ${team.strWebsite ? "https://" + team.strWebsite : "N/A"}\n\n` +
        `${(team.strDescriptionEN || "").slice(0, 300)}${team.strDescriptionEN?.length > 300 ? "..." : ""}`;
      if (team.strBadge) {
        await trashcore.sendMessage(chat, { image: { url: team.strBadge }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      return xreply("❌ Failed to fetch team info.");
    }
  }
};
