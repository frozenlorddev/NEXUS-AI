const axios = require("axios");

const fallback = [
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Do you have a name, or can I call you mine?",
  "Are you a parking ticket? Because you've got 'fine' written all over you.",
  "Is your name Google? Because you have everything I've been searching for.",
  "Do you believe in love at first text, or should I message you again?",
  "Are you a bank loan? Because you have my interest.",
  "Do you have a map? I keep getting lost in your eyes.",
  "Are you a Wi-Fi signal? Because I feel a connection.",
  "Is it hot in here or is it just you?",
  "Are you a camera? Because every time I look at you, I smile.",
];

module.exports = {
  command: ["pickup", "flirt", "pickupline"],
  desc: "Get a random pickup line",
  category: "Fun",
  usage: ".pickup",
  run: async ({ xreply }) => {
    try {
      const { data } = await axios.get("https://api.dadjokes.io/api/pickuplines/random", { timeout: 6000 });
      const line = data?.joke || data?.line || fallback[Math.floor(Math.random() * fallback.length)];
      return xreply(`💘 *Pickup Line*\n\n${line}`);
    } catch {
      return xreply(`💘 *Pickup Line*\n\n${fallback[Math.floor(Math.random() * fallback.length)]}`);
    }
  }
};
