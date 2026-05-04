const axios = require("axios");

const LEAGUES = {
  "premier league": "4328", "epl": "4328",
  "la liga": "4335", "laliga": "4335",
  "bundesliga": "4331",
  "serie a": "4332",
  "ligue 1": "4334",
  "champions league": "4480",
  "eredivisie": "4337",
  "premier league kenya": "4958",
};

module.exports = {
  command: ["standings", "table", "leaguetable"],
  desc: "View football league standings",
  category: "Betting",
  usage: ".standings [league]",
  run: async ({ args, xreply }) => {
    const input = args.join(" ").toLowerCase() || "premier league";
    const leagueId = LEAGUES[input] || "4328";
    const leagueName = args.join(" ") || "Premier League";
    try {
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${leagueId}&s=2023-2024`,
        { timeout: 10000 }
      );
      const table = data?.table;
      if (!table || !table.length) return xreply(`❌ No standings found for *${leagueName}*. Try: .standings Premier League`);
      let text = `🏆 *${table[0]?.strLeague || leagueName} Standings*\n━━━━━━━━━━━━━━━━━━\n\`Pos  Team              Pts\`\n`;
      table.slice(0, 20).forEach(t => {
        const pos = String(t.intRank).padEnd(4);
        const name = (t.strTeam || "").slice(0, 16).padEnd(17);
        const pts = t.intPoints || "0";
        text += `\`${pos} ${name} ${pts}\`\n`;
      });
      return xreply(text.trim());
    } catch {
      return xreply("❌ Failed to fetch standings. Try: .standings Premier League");
    }
  }
};
