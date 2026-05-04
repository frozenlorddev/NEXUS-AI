const { getTopEconomy } = require("../../database");

module.exports = {
  command: ["richlist", "topcoin", "leaderboard", "rich"],
  desc: "View the richest users leaderboard",
  category: "Economy",
  usage: ".richlist",
  run: async ({ xreply }) => {
    const top = getTopEconomy(10);
    if (!top.length) return xreply("📊 No economy data yet. Use .daily to get started!");
    const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
    const list = top.map((u, i) => {
      const total = u.coins + u.bank;
      return `${medals[i]} @${u.user_id} — *${total.toLocaleString()} coins*`;
    }).join("\n");
    return xreply(`💰 *Richest Users*\n\n${list}\n\n_Use .daily and .work to earn coins!_`);
  }
};
