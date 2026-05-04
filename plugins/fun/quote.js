const axios = require("axios");

module.exports = {
  command: ["quote", "inspire"],
  desc: "Get a random inspirational quote",
  category: "Fun",
  usage: ".quote",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get("https://zenquotes.io/api/random", { timeout: 10000 });
      const q = data[0];
      return xreply(`💬 *Quote*\n\n"${q.q}"\n\n— _${q.a}_`);
    } catch {
      const quotes = [
        { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
        { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
        { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
        { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
      ];
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      return xreply(`💬 *Quote*\n\n"${q.q}"\n\n— _${q.a}_`);
    }
  }
};
