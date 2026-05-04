const axios = require("axios");

module.exports = {
  command: ["spotify", "sp"],
  desc: "Search and download a song from Spotify",
  category: "Media",
  usage: ".spotify <song name>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("🎵 Usage: .spotify <song name>\nExample: .spotify Blinding Lights");
    const query = args.join(" ");
    await xreply("🎵 Searching Spotify...");
    try {
      const { data } = await axios.get(
        `https://api.zenzxz.my.id/download/spotify?q=${encodeURIComponent(query)}`,
        { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 30000 }
      );
      if (!data.status || !data.result) throw new Error("No result");
      const r = data.result;
      if (r.thumbnail) {
        await trashcore.sendMessage(chat, {
          image: { url: r.thumbnail },
          caption: `🎵 *${r.title || query}*\n🎤 Artist: ${r.artist || "Unknown"}`
        }, { quoted: m });
      }
      if (r.download) {
        await trashcore.sendMessage(chat, {
          audio: { url: r.download },
          mimetype: "audio/mpeg",
          fileName: `${r.title || query}.mp3`
        }, { quoted: m });
      }
    } catch {
      await xreply("❌ Could not find that song on Spotify. Try .ytmp3 instead.");
    }
  }
};
