const axios = require("axios");

module.exports = {
  command: ["anime", "manga"],
  desc: "Search for anime or manga info",
  category: "Search",
  usage: ".anime <title> | .manga <title>",
  run: async ({ command, args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply(`🎌 Usage: .${command} <title>\nExample: .anime Naruto`);
    const query = args.join(" ");
    const type = command === "manga" ? "manga" : "anime";
    try {
      const { data } = await axios.get(
        `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(query)}&limit=1`,
        { timeout: 10000 }
      );
      const item = data?.data?.[0];
      if (!item) return xreply(`❌ ${command} "${query}" not found.`);
      const text =
        `🎌 *${item.title}*\n` +
        (item.title_english ? `🇬🇧 ${item.title_english}\n` : "") +
        `⭐ Score: *${item.score || "N/A"}* (${item.scored_by?.toLocaleString() || 0} votes)\n` +
        `📺 Status: ${item.status || "N/A"}\n` +
        `🎬 Episodes: ${item.episodes || "N/A"}\n` +
        `📅 Aired: ${item.aired?.string || item.published?.string || "N/A"}\n` +
        `🏷️ Genres: ${item.genres?.map(g => g.name).join(", ") || "N/A"}\n` +
        `🏆 Rank: #${item.rank || "N/A"}\n\n` +
        `📖 *Synopsis:*\n${(item.synopsis || "N/A").slice(0, 400)}${item.synopsis?.length > 400 ? "..." : ""}`;
      const imgUrl = item.images?.jpg?.image_url;
      if (imgUrl) {
        await trashcore.sendMessage(chat, { image: { url: imgUrl }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      await xreply(`❌ Failed to fetch ${command} info. Try again.`);
    }
  }
};
