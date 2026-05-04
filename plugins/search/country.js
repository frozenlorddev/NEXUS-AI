const axios = require("axios");

module.exports = {
  command: ["country", "flag", "nation"],
  desc: "Get information about a country",
  category: "Search",
  usage: ".country <name>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("🌍 Usage: .country <name>\nExample: .country Kenya");
    const query = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`,
        { timeout: 10000 }
      );
      const c = data[0];
      const currencies = Object.values(c.currencies || {}).map(cu => `${cu.name} (${cu.symbol})`).join(", ");
      const languages = Object.values(c.languages || {}).join(", ");
      const text =
        `🌍 *${c.name.common}*\n` +
        `🔖 Official: ${c.name.official}\n` +
        `🌎 Region: ${c.region} — ${c.subregion}\n` +
        `🏙️ Capital: ${c.capital?.[0] || "N/A"}\n` +
        `👥 Population: ${c.population?.toLocaleString()}\n` +
        `📐 Area: ${c.area?.toLocaleString()} km²\n` +
        `💰 Currency: ${currencies}\n` +
        `🗣️ Languages: ${languages}\n` +
        `🏳️ Flag: ${c.flag}\n` +
        `📞 Calling Code: +${c.idd?.root}${c.idd?.suffixes?.[0] || ""}\n` +
        `🌐 TLD: ${c.tld?.[0] || "N/A"}\n` +
        `🚗 Driving: ${c.car?.side || "N/A"} side`;
      if (c.flags?.png) {
        await trashcore.sendMessage(chat, { image: { url: c.flags.png }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      await xreply("❌ Country not found. Try the full name.");
    }
  }
};
