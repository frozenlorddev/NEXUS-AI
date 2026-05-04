const axios = require("axios");

module.exports = {
  command: ["github", "gh", "gitrepo"],
  desc: "Search GitHub user or repository",
  category: "Search",
  usage: ".github <username> | .gitrepo <user/repo>",
  run: async ({ command, args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply(`❌ Usage: .github <username> or .github <user/repo>`);
    const query = args[0];
    try {
      if (query.includes("/")) {
        const { data } = await axios.get(`https://api.github.com/repos/${query}`, { timeout: 10000, headers: { "User-Agent": "WhatsApp-Bot" } });
        const text =
          `📦 *${data.full_name}*\n` +
          `📝 ${data.description || "No description"}\n\n` +
          `⭐ Stars: *${data.stargazers_count?.toLocaleString()}*\n` +
          `🍴 Forks: *${data.forks_count?.toLocaleString()}*\n` +
          `👁️ Watchers: *${data.watchers_count?.toLocaleString()}*\n` +
          `📋 Issues: *${data.open_issues_count}*\n` +
          `💻 Language: *${data.language || "N/A"}*\n` +
          `📅 Created: ${new Date(data.created_at).toLocaleDateString("en-GB")}\n` +
          `🔗 ${data.html_url}`;
        return xreply(text);
      }
      const { data } = await axios.get(`https://api.github.com/users/${query}`, { timeout: 10000, headers: { "User-Agent": "WhatsApp-Bot" } });
      const text =
        `👤 *${data.name || data.login}*\n` +
        `🔗 @${data.login}\n` +
        `📝 ${data.bio || "No bio"}\n\n` +
        `📦 Repos: *${data.public_repos}*\n` +
        `👥 Followers: *${data.followers?.toLocaleString()}*\n` +
        `➡️ Following: *${data.following}*\n` +
        `📍 Location: ${data.location || "N/A"}\n` +
        `🏢 Company: ${data.company || "N/A"}\n` +
        `🔗 ${data.html_url}`;
      if (data.avatar_url) {
        await trashcore.sendMessage(chat, { image: { url: data.avatar_url }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      await xreply("❌ GitHub user or repo not found.");
    }
  }
};
