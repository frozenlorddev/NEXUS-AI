module.exports = {
  command: ["random", "rand", "choose", "pick"],
  desc: "Pick a random item from a list or generate random number",
  category: "Utility",
  usage: ".random <min> <max> | .choose <item1, item2, ...>",
  run: async ({ command, args, xreply }) => {
    if (!args.length) {
      return xreply(
        "❌ Usage:\n" +
        "• .random <min> <max> — random number\n" +
        "• .choose <a, b, c, ...> — pick from list\n" +
        "Example: .random 1 100\nExample: .choose pizza, burger, sushi"
      );
    }
    if (command === "choose" || command === "pick" || args.join("").includes(",")) {
      const items = args.join(" ").split(",").map(s => s.trim()).filter(Boolean);
      if (items.length < 2) return xreply("❌ Provide at least 2 items separated by commas.\nExample: .choose pizza, burger, tacos");
      const picked = items[Math.floor(Math.random() * items.length)];
      return xreply(`🎯 *Random Pick*\n\nFrom: ${items.join(", ")}\n\n➡️ *${picked}*`);
    }
    const min = parseInt(args[0]), max = parseInt(args[1]);
    if (isNaN(min) || isNaN(max)) return xreply("❌ Usage: .random <min> <max>");
    if (min >= max) return xreply("❌ Min must be less than max.");
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    return xreply(`🎲 *Random Number*\n\nRange: ${min} – ${max}\nResult: *${result}*`);
  }
};
