const { getRep, addRep, getTopRep } = require("../../database");

module.exports = {
  command: ["rep", "reputation", "toprep"],
  desc: "Give reputation points or check rep leaderboard",
  category: "Social",
  usage: ".rep @user | .toprep",
  run: async ({ command, m, sender, xreply }) => {
    if (command === "toprep") {
      const top = getTopRep(10);
      if (!top.length) return xreply("📊 No reputation data yet. Use .rep @user to give rep!");
      const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
      const list = top.map((u, i) => `${medals[i]} @${u.user_id} — *${u.rep_points} rep*`).join("\n");
      return xreply(`⭐ *Reputation Leaderboard*\n\n${list}`);
    }
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!target) return xreply("❌ Usage: .rep @user\nCheck your own rep: .rep (no mention)\n\nLeaderboard: .toprep");
    const targetNum = target.split("@")[0];
    if (targetNum === sender) return xreply("❌ You can't give rep to yourself!");
    const result = addRep(targetNum, sender);
    if (!result.success) {
      const h = Math.floor(result.remaining / 3600000);
      const min = Math.floor((result.remaining % 3600000) / 60000);
      return xreply(`⏳ You already repped @${targetNum} recently.\nCome back in *${h}h ${min}m*`);
    }
    const newRep = getRep(targetNum).rep_points;
    return xreply(`⭐ *+1 Rep given to @${targetNum}!*\nThey now have *${newRep} reputation points* 🌟`);
  }
};
