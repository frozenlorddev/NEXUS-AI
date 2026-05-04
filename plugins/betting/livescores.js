const axios = require("axios");

module.exports = {
  command: ["livescores", "live", "scores"],
  desc: "Get live football scores",
  category: "Betting",
  usage: ".live",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get(
        "https://www.thesportsdb.com/api/v1/json/3/liveevents.php?s=Soccer",
        { timeout: 10000 }
      );
      const events = data?.events;
      if (!events || events.length === 0) {
        return xreply("⚽ *Live Scores*\n\nNo live matches right now.\nUse .fixtures for upcoming matches.");
      }
      let text = "⚽ *LIVE SCORES* 🔴\n━━━━━━━━━━━━━━━━━━\n\n";
      events.slice(0, 15).forEach(e => {
        const h = e.strHomeTeam || "Home";
        const a = e.strAwayTeam || "Away";
        const hs = e.intHomeScore ?? "?";
        const as = e.intAwayScore ?? "?";
        const min = e.strProgress || e.strStatus || "LIVE";
        text += `🔴 *${min}*\n${h} *${hs} - ${as}* ${a}\n${e.strLeague || ""}\n\n`;
      });
      return xreply(text.trim());
    } catch {
      return xreply("❌ Could not fetch live scores. Please try again later.");
    }
  }
};
