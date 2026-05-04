const axios = require("axios");

module.exports = {
  command: ["meme", "randmeme", "dankmeme"],
  desc: "Get a random meme",
  category: "Fun",
  usage: ".meme [subreddit]",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    const sub = args[0] || ["memes","dankmemes","me_irl","funny","AdviceAnimals"][Math.floor(Math.random()*5)];
    try {
      const { data } = await axios.get(
        `https://meme-api.com/gimme/${encodeURIComponent(sub)}`,
        { timeout: 10000 }
      );
      if (!data?.url) throw new Error("No meme");
      await trashcore.sendMessage(chat, {
        image: { url: data.url },
        caption: `😂 *${data.title}*\n\n👍 ${data.ups?.toLocaleString()} | r/${data.subreddit}`
      }, { quoted: m });
    } catch {
      await xreply("❌ Failed to fetch meme. Try again!");
    }
  }
};
