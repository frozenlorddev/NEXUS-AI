const axios = require("axios");

module.exports = {
  command: ["lyrics", "lyric"],
  desc: "Get song lyrics",
  category: "AI",
  usage: ".lyrics <song name> - <artist>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("🎵 Usage: .lyrics <song>\nExample: .lyrics Shape of You - Ed Sheeran");
    const query = args.join(" ");
    let artist = "", title = query;
    if (query.includes(" - ")) {
      const parts = query.split(" - ");
      title = parts[0].trim();
      artist = parts[1]?.trim() || "";
    }
    try {
      const url = artist
        ? `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
        : `https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`;
      if (!artist) {
        const { data: suggest } = await axios.get(url, { timeout: 10000 });
        if (!suggest.data?.length) return xreply("❌ Song not found. Try: .lyrics <title> - <artist>");
        const song = suggest.data[0];
        const { data } = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`, { timeout: 10000 });
        const lyrics = data.lyrics?.trim();
        if (!lyrics) return xreply("❌ Lyrics not found for this song.");
        const preview = lyrics.length > 2000 ? lyrics.slice(0, 2000) + "\n\n...(truncated)" : lyrics;
        return xreply(`🎵 *${song.title}* — ${song.artist.name}\n\n${preview}`);
      } else {
        const { data } = await axios.get(url, { timeout: 10000 });
        const lyrics = data.lyrics?.trim();
        if (!lyrics) return xreply("❌ Lyrics not found.");
        const preview = lyrics.length > 2000 ? lyrics.slice(0, 2000) + "\n\n...(truncated)" : lyrics;
        return xreply(`🎵 *${title}* — ${artist}\n\n${preview}`);
      }
    } catch {
      return xreply("❌ Could not fetch lyrics. Try: .lyrics <title> - <artist>");
    }
  }
};
