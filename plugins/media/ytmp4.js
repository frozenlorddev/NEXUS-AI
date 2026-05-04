const axios = require("axios");

module.exports = {
  command: ["ytmp4", "ytv", "ytvideo"],
  desc: "Download YouTube video (MP4)",
  category: "Media",
  usage: ".ytmp4 <YouTube URL or video name>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("🎬 Usage: .ytmp4 <URL or video name>\nExample: .ytmp4 Rick Astley Never Gonna Give You Up");
    const query = args.join(" ");
    await xreply("⏳ Fetching video, please wait...");
    try {
      const { data } = await axios.get(
        `https://api.zenzxz.my.id/download/youtube?q=${encodeURIComponent(query)}&type=mp4`,
        { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 40000 }
      );
      if (!data.status || !data.result) throw new Error("No result");
      const r = data.result;
      await trashcore.sendMessage(chat, {
        video: { url: r.download },
        caption: `🎬 *${r.title || "Video"}*\n👤 ${r.author || "Unknown"}\n📁 Quality: ${r.quality || "360"}p`,
        mimetype: "video/mp4",
        fileName: `${r.title || "video"}.mp4`
      }, { quoted: m });
    } catch {
      await xreply("❌ Could not download video. Try a shorter video or different search.");
    }
  }
};
