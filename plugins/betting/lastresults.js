const axios = require("axios");

module.exports = {
  command: ["lastresults", "results", "recent"],
  desc: "Get recent results for a football team",
  category: "Betting",
  usage: ".results <team name>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .results <team name>\nExample: .results Arsenal");
    const query = args.join(" ");
    try {
      const teamRes = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`,
        { timeout: 10000 }
      );
      const team = teamRes.data?.teams?.[0];
      if (!team) return xreply(`❌ Team "${query}" not found.`);
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.idTeam}`,
        { timeout: 10000 }
      );
      const events = data?.results;
      if (!events || !events.length) return xreply(`❌ No recent results for *${team.strTeam}*.`);
      let text = `📊 *${team.strTeam} — Recent Results*\n━━━━━━━━━━━━━━━━\n\n`;
      events.slice(-8).reverse().forEach(e => {
        const hs = parseInt(e.intHomeScore), as = parseInt(e.intAwayScore);
        const isHome = e.strHomeTeam === team.strTeam;
        let outcome;
        if (isHome) outcome = hs > as ? "✅ W" : hs === as ? "🤝 D" : "❌ L";
        else outcome = as > hs ? "✅ W" : hs === as ? "🤝 D" : "❌ L";
        const date = e.dateEvent;
        text += `${outcome} ${e.strHomeTeam} *${hs}-${as}* ${e.strAwayTeam}\n_${date} · ${e.strLeague}_\n\n`;
      });
      return xreply(text.trim());
    } catch {
      return xreply("❌ Failed to fetch results.");
    }
  }
};
