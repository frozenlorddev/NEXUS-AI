const axios = require("axios");

module.exports = {
  command: ["fact", "funfact"],
  desc: "Get a random fun fact",
  category: "Fun",
  usage: ".fact",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", { timeout: 10000 });
      return xreply(`🧠 *Fun Fact*\n\n${data.text}`);
    } catch {
      const facts = [
        "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
        "A group of flamingos is called a flamboyance.",
        "Octopuses have three hearts and blue blood.",
        "The shortest war in history lasted 38–45 minutes — the Anglo-Zanzibar War of 1896.",
        "Bananas are berries, but strawberries are not.",
      ];
      return xreply(`🧠 *Fun Fact*\n\n${facts[Math.floor(Math.random() * facts.length)]}`);
    }
  }
};
