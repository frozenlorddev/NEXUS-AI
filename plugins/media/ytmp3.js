const axios = require("axios");

module.exports = {
  command: ["ytmp3", "yta", "ytsong"],
  desc: "Download YouTube audio (MP3)",
  category: "Media",
  usage: ".ytmp3 <YouTube URL or song name>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("🎵 Usage: .ytmp3 <URL or song name>\nExample: .ytmp3 Faded Alan Walker");
    const query = args.join(" ");
    await xreply("⏳ Fetching audio, please wait...");
    try {
      const { data } = await axios.get(
        `https://api.zenzxz.my.id/download/youtube?q=${encodeURIComponent(query)}&type=mp3`,
        { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 30000 }
      );
      if (!data.status || !data.result) throw new Error("No result");
      const r = data.result;
      await trashcore.sendMessage(chat, {
        image: { url: r.thumbnail },
        caption: `🎵 *${r.title || "Unknown"}*\n🎤 Artist: ${r.author || "Unknown"}\n💿 Quality: ${r.quality || "128"}kbps`
      }, { quoted: m });
      await trashcore.sendMessage(chat, {
        audio: { url: r.download },
        mimetype: "audio/mpeg",
        fileName: `${r.title || "audio"}.mp3`
      }, { quoted: m });
    } catch {
      await xreply("❌ Could not download audio. Check the URL or try a different search term.");
    }
  }
};
