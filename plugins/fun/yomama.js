const axios = require("axios");

const fallback = [
  "Yo mama so slow, even a snail overtook her while she was loading!",
  "Yo mama so old, even her birth certificate has expired!",
  "Yo mama so forgetful, she set her alarm for yesterday!",
  "Yo mama so bad at directions, she got lost on a one-way street!",
];

module.exports = {
  command: ["yomama", "mama", "yomamajoke"],
  desc: "Get a random Yo Mama joke",
  category: "Fun",
  usage: ".yomama",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get("https://www.yomama-jokes.com/api/v1/jokes/random/", { timeout: 6000 });
      const joke = data?.joke || fallback[Math.floor(Math.random() * fallback.length)];
      return xreply(`😂 *Yo Mama*\n\n${joke}`);
    } catch {
      return xreply(`😂 *Yo Mama*\n\n${fallback[Math.floor(Math.random() * fallback.length)]}`);
    }
  }
};
