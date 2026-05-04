module.exports = {
  command: ["b64encode", "b64decode", "base64"],
  desc: "Encode or decode Base64",
  category: "Utility",
  usage: ".b64encode <text> | .b64decode <base64>",
  run: async ({ command, args, xreply }) => {
    if (!args.length) return xreply(`❌ Usage:\n.b64encode <text>\n.b64decode <encoded>`);
    const input = args.join(" ");
    if (command === "b64encode") {
      const encoded = Buffer.from(input).toString("base64");
      return xreply(`🔒 *Base64 Encoded*\n\n${encoded}`);
    } else {
      try {
        const decoded = Buffer.from(input, "base64").toString("utf-8");
        return xreply(`🔓 *Base64 Decoded*\n\n${decoded}`);
      } catch {
        return xreply("❌ Invalid Base64 string.");
      }
    }
  }
};
