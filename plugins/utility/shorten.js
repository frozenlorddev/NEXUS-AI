const axios = require("axios");

module.exports = {
  command: ["shorten", "short", "url"],
  desc: "Shorten a URL",
  category: "Utility",
  usage: ".shorten <url>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .shorten <url>\nExample: .shorten https://google.com");
    const url = args[0];
    if (!url.startsWith("http")) return xreply("❌ Please provide a valid URL starting with http:// or https://");
    try {
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 10000 });
      return xreply(`🔗 *URL Shortener*\n\n📎 Original: ${url}\n✅ Short: ${data}`);
    } catch {
      return xreply("❌ Failed to shorten URL. Please try again.");
    }
  }
};
