module.exports = {
  command: ["coinflip", "flip", "coin"],
  desc: "Flip a coin",
  category: "Fun",
  usage: ".coinflip",
  run: async ({ xreply }) => {
    const result = Math.random() < 0.5 ? "🪙 *HEADS*" : "🪙 *TAILS*";
    return xreply(`Flipping coin...\n\n${result}`);
  }
};
