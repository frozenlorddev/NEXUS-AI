const axios = require("axios");

module.exports = {
  command: ["joke"],
  desc: "Get a random joke",
  category: "Fun",
  usage: ".joke",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist&format=json", { timeout: 10000 });
      if (data.type === "single") {
        return xreply(`😂 *Joke*\n\n${data.joke}`);
      } else {
        return xreply(`😂 *Joke*\n\n${data.setup}\n\n🥁 ${data.delivery}`);
      }
    } catch {
      return xreply("❌ Failed to fetch a joke. Try again!");
    }
  }
};
