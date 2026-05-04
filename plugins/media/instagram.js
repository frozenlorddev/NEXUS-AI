const axios = require("axios");

module.exports = {
  command: ["ig", "instagram", "igdl"],
  desc: "Download Instagram photo or video",
  category: "Media",
  usage: ".ig <instagram post URL>",
  run: async ({ trashcore, m, args, chat, xreply }) => {
    if (!args.length) return xreply("📸 Usage: .ig <Instagram URL>\nExample: .ig https://www.instagram.com/p/xxxxx/");
    const url = args[0];
    if (!url.includes("instagram.com")) return xreply("❌ Please provide a valid Instagram URL.");
    await xreply("⏳ Downloading from Instagram...");
    try {
      const { data } = await axios.get(
        `https://api.zenzxz.my.id/download/instagram?url=${encodeURIComponent(url)}`,
        { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 30000 }
      );
      if (!data.status || !data.result) throw new Error("No result");
      const r = data.result;
      const mediaUrl = Array.isArray(r) ? r[0].url : r.url || r.download;
      const mime = mediaUrl.includes(".mp4") || r.type === "video" ? "video" : "image";
      if (mime === "video") {
        await trashcore.sendMessage(chat, {
          video: { url: mediaUrl },
          caption: "📸 Instagram Video",
          mimetype: "video/mp4"
        }, { quoted: m });
      } else {
        await trashcore.sendMessage(chat, {
          image: { url: mediaUrl },
          caption: "📸 Instagram Photo"
        }, { quoted: m });
      }
    } catch {
      await xreply("❌ Failed to download. Make sure the post is public.");
    }
  }
};
