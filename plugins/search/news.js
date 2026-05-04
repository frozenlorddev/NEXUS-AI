const axios = require("axios");

module.exports = {
  command: ["news", "headline", "headlines"],
  desc: "Get latest news headlines",
  category: "Search",
  usage: ".news [topic]",
  run: async ({ args, xreply }) => {
    const topic = args.join(" ") || "world";
    try {
      const { data } = await axios.get(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=5&apikey=pub_demo`,
        { timeout: 10000 }
      );
      if (!data?.articles?.length) throw new Error("No articles");
      let text = `📰 *Latest News — ${topic}*\n━━━━━━━━━━━━━━━━━━\n\n`;
      data.articles.slice(0, 5).forEach((a, i) => {
        text += `*${i+1}. ${a.title}*\n_${a.source?.name}_\n${a.url}\n\n`;
      });
      return xreply(text.trim());
    } catch {
      try {
        const { data } = await axios.get(
          `https://api.currentsapi.services/v1/latest-news?language=en&keywords=${encodeURIComponent(topic)}&apiKey=demo`,
          { timeout: 10000 }
        );
        if (!data?.news?.length) throw new Error("No news");
        let text = `📰 *Latest News — ${topic}*\n━━━━━━━━━━━━━━━━━━\n\n`;
        data.news.slice(0, 5).forEach((a, i) => {
          text += `*${i+1}. ${a.title}*\n${a.url}\n\n`;
        });
        return xreply(text.trim());
      } catch {
        return xreply("❌ Could not fetch news. Please try again later.");
      }
    }
  }
};
