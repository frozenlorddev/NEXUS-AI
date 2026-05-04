const axios = require("axios");

module.exports = {
  command: ["wiki", "wikipedia", "search"],
  desc: "Search Wikipedia for a topic",
  category: "Utility",
  usage: ".wiki <topic>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .wiki <topic>\nExample: .wiki Elon Musk");
    const query = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        { timeout: 10000 }
      );
      if (data.type === "disambiguation") {
        return xreply(`🔍 *${data.title}* is ambiguous. Try being more specific.`);
      }
      const extract = data.extract?.slice(0, 800) || "No summary available.";
      return xreply(`📖 *${data.title}*\n\n${extract}${data.extract?.length > 800 ? "..." : ""}\n\n🔗 ${data.content_urls?.mobile?.page || ""}`);
    } catch {
      return xreply("❌ No Wikipedia article found for that topic.");
    }
  }
};
