module.exports = {
  command: ["dice", "roll"],
  desc: "Roll a dice (default d6, or specify sides)",
  category: "Fun",
  usage: ".dice [sides]",
  run: async ({ args, xreply }) => {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 100) return xreply("❌ Sides must be between 2 and 100.");
    const result = Math.floor(Math.random() * sides) + 1;
    return xreply(`🎲 Rolling a ${sides}-sided dice...\n\nResult: *${result}*`);
  }
};
