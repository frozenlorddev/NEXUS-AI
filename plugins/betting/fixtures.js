const axios = require("axios");

module.exports = {
  command: ["fixtures", "upcoming", "matches", "schedule"],
  desc: "Get upcoming football fixtures",
  category: "Betting",
  usage: ".fixtures [league name]",
  run: async ({ args, xreply }) => {
    try {
      const league = args.join(" ") || "Premier League";
      const searchRes = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchleagues.php?t=${encodeURIComponent(league)}`,
        { timeout: 10000 }
      );
      const leagueData = searchRes.data?.countrys?.[0] || searchRes.data?.leagues?.[0];
      const leagueId = leagueData?.idLeague || "4328";
      const leagueName = leagueData?.strLeague || league;
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`,
        { timeout: 10000 }
      );
      const events = data?.events;
      if (!events || !events.length) return xreply(`⚽ No upcoming fixtures found for *${leagueName}*`);
      let text = `📅 *Upcoming ${leagueName} Fixtures*\n━━━━━━━━━━━━━━━━━━\n\n`;
      events.slice(0, 10).forEach(e => {
        const date = new Date(e.strTimestamp || e.dateEvent).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
        const time = e.strTime ? e.strTime.slice(0, 5) + " UTC" : "TBD";
        text += `📅 *${date}* — ${time}\n🏠 ${e.strHomeTeam}\n✈️ ${e.strAwayTeam}\n\n`;
      });
      return xreply(text.trim());
    } catch {
      return xreply("❌ Could not fetch fixtures. Try: .fixtures Premier League");
    }
  }
};
