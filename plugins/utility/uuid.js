const { randomUUID } = require("crypto");

module.exports = {
  command: ["uuid", "uid", "generateid"],
  desc: "Generate a random UUID",
  category: "Utility",
  usage: ".uuid [count]",
  run: async ({ args, xreply }) => {
    const count = Math.min(parseInt(args[0]) || 1, 10);
    const ids = Array.from({ length: count }, () => randomUUID());
    return xreply(`🔑 *UUID Generator*\n\n\`\`\`${ids.join("\n")}\`\`\``);
  }
};
