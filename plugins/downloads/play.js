const axios = require("axios");

module.exports = {
  command: ["play"],
  desc: "Play song from YouTube",
  category: "Music",
  usage: ".play <song name>",

  run: async ({ trashcore, m, args, xreply, chat }) => {
    try {

      if (!args.length) {
        return xreply("🎵 Please provide a song name\nExample: .play Faded");
      }

      const query = args.join(" ");
      const api = `https://api.zenzxz.my.id/download/youtube?q=${encodeURIComponent(query)}&type=mp3`;

      const { data } = await axios.get(api, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 20000
      });

      if (!data.status || !data.result) {
        return xreply("❌ Song not found.");
      }

      const r = data.result;

      const title = r.title || "Unknown";
      const artist = r.author || "Unknown";
      const thumb = r.thumbnail;
      const audio = r.download;
      const file = r.filename || `${title}.mp3`;

      // Send thumbnail + info
      await trashcore.sendMessage(
        chat,
        {
          image: { url: thumb },
          caption:
`🎶 *Now Playing*

🎵 Title: ${title}
🎤 Artist: ${artist}
💿 Quality: ${r.quality}kbps`
        },
        { quoted: m }
      );

      // Send audio
      await trashcore.sendMessage(
        chat,
        {
          audio: { url: audio },
          mimetype: "audio/mpeg",
          fileName: file
        },
        { quoted: m }
      );

    } catch (err) {
      console.log("PLAY ERROR:", err?.response?.data || err.message);
      xreply("⚠️ Failed to fetch the song.");
    }
  }
};