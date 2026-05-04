const axios = require("axios");

module.exports = {
  command: ["dadjoke", "dad", "pun"],
  desc: "Get a random dad joke or pun",
  category: "Fun",
  usage: ".dadjoke",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
        timeout: 8000
      });
      return xreply(`👴 *Dad Joke*\n\n${data.joke}`);
    } catch {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
        "Why do cows wear bells? Because their horns don't work!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      ];
      return xreply(`👴 *Dad Joke*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`);
    }
  }
};
