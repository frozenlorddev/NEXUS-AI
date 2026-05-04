module.exports = {
  command: ["upper", "lower", "reverse", "mock", "aesthetic", "clap", "vaporwave"],
  desc: "Text formatting commands",
  category: "Text",
  usage: ".upper <text> | .lower <text> | .reverse <text> | .mock <text> | .aesthetic <text>",
  run: async ({ command, args, xreply }) => {
    if (!args.length) return xreply(`❌ Usage: .${command} <text>`);
    const text = args.join(" ");
    let result;
    switch (command) {
      case "upper":      result = text.toUpperCase(); break;
      case "lower":      result = text.toLowerCase(); break;
      case "reverse":    result = text.split("").reverse().join(""); break;
      case "mock":       result = text.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""); break;
      case "aesthetic":
      case "vaporwave":
        result = text.split("").map(c => c === " " ? "　" : String.fromCharCode(c.charCodeAt(0) + (c.match(/[a-zA-Z0-9]/) ? 65248 : 0))).join(""); break;
      case "clap":       result = text.split(" ").join(" 👏 "); break;
      default: result = text;
    }
    return xreply(`✨ *${command}*\n\n${result}`);
  }
};
