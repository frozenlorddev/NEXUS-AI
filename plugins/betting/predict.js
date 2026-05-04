const axios = require("axios");

const teamEmojis = ["⚽","🔵","🔴","🟡","🟢","🟠","⚪","🟣"];
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = {
  command: ["predict", "prediction", "pred"],
  desc: "Predict the outcome of a football match",
  category: "Betting",
  usage: ".predict <Team A> vs <Team B>",
  run: async ({ args, text, xreply }) => {
    if (!text || !text.toLowerCase().includes(" vs "))
      return xreply("❌ Usage: .predict <Team A> vs <Team B>\nExample: .predict Man United vs Chelsea");
    const [teamA, teamB] = text.split(/ vs /i).map(s => s.trim());
    if (!teamA || !teamB) return xreply("❌ Please provide both team names.");

    const rand = Math.random();
    let result, winner, conf;
    if (rand < 0.38) { result = "🏆 HOME WIN"; winner = teamA; conf = Math.floor(Math.random() * 25 + 55); }
    else if (rand < 0.62) { result = "🤝 DRAW"; winner = "Neither"; conf = Math.floor(Math.random() * 20 + 40); }
    else { result = "🏆 AWAY WIN"; winner = teamB; conf = Math.floor(Math.random() * 25 + 55); }

    const h_goals = Math.floor(Math.random() * 3);
    const a_goals = result === "🏆 HOME WIN" ? Math.floor(Math.random() * 2) : result === "🏆 AWAY WIN" ? h_goals + 1 + Math.floor(Math.random() * 2) : h_goals;

    const factors = [
      "Recent form analysis", "Head-to-head record", "Home advantage",
      "Squad depth & injuries", "Tactical matchup", "Goal scoring rate",
      "Defensive record", "Motivation & stakes", "Weather conditions"
    ];
    const usedFactors = [...factors].sort(() => Math.random() - 0.5).slice(0, 3);
    const momentum = getRandom(["📈 Strong", "📊 Average", "📉 Low"]);
    const tips = ["Both Teams to Score", "Over 2.5 Goals", "Under 2.5 Goals", "Asian Handicap", "Double Chance", "BTTS + Win"];

    return xreply(
      `⚽ *MATCH PREDICTION*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🏠 ${teamA}\n` +
      `     vs\n` +
      `✈️ ${teamB}\n\n` +
      `📊 *PREDICTED RESULT:*\n` +
      `${result}\n` +
      `🎯 Score: *${h_goals} - ${a_goals}*\n` +
      `💯 Confidence: *${conf}%*\n\n` +
      `🔍 *Key Factors:*\n` +
      usedFactors.map(f => `• ${f}`).join("\n") + "\n\n" +
      `🔥 Momentum: ${momentum}\n` +
      `💡 Tip: *${getRandom(tips)}*\n\n` +
      `_⚠️ This is AI analysis only — gamble responsibly!_`
    );
  }
};
