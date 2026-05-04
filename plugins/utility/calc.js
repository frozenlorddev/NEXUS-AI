module.exports = {
  command: ["calc", "calculate", "math"],
  desc: "Calculate a math expression",
  category: "Utility",
  usage: ".calc <expression>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .calc <expression>\nExample: .calc 2 + 2 * 10");
    const expr = args.join(" ").replace(/[^0-9+\-*/.()%^ ]/g, "");
    if (!expr.trim()) return xreply("❌ Invalid expression.");
    try {
      const result = Function('"use strict"; return (' + expr + ')')();
      if (!isFinite(result)) return xreply("❌ Math error (division by zero or overflow).");
      return xreply(`🧮 *Calculator*\n\n📝 ${args.join(" ")}\n= *${result}*`);
    } catch {
      return xreply("❌ Invalid math expression.");
    }
  }
};
