const axios = require("axios");

module.exports = {
  command: ["movie", "film", "imdb"],
  desc: "Search for movie or TV show information",
  category: "Search",
  usage: ".movie <title>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("🎬 Usage: .movie <title>\nExample: .movie Avengers");
    const query = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=trilogy&plot=short`,
        { timeout: 10000 }
      );
      if (data.Response === "False") {
        const { data: search } = await axios.get(
          `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=trilogy`,
          { timeout: 10000 }
        );
        if (search.Search?.length) {
          const list = search.Search.slice(0, 5).map((m, i) => `${i+1}. ${m.Title} (${m.Year})`).join("\n");
          return xreply(`🎬 *Search Results for "${query}"*\n\n${list}\n\nTry being more specific!`);
        }
        return xreply(`❌ Movie "${query}" not found.`);
      }
      const text =
        `🎬 *${data.Title}* (${data.Year})\n` +
        `⭐ Rating: *${data.imdbRating}/10* (${data.imdbVotes} votes)\n` +
        `🎭 Genre: ${data.Genre}\n` +
        `🎬 Director: ${data.Director}\n` +
        `🌟 Cast: ${data.Actors}\n` +
        `⏱️ Runtime: ${data.Runtime}\n` +
        `🌍 Language: ${data.Language}\n\n` +
        `📖 *Plot:*\n${data.Plot}`;
      if (data.Poster && data.Poster !== "N/A") {
        await trashcore.sendMessage(chat, { image: { url: data.Poster }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      await xreply("❌ Failed to fetch movie info. Please try again.");
    }
  }
};
