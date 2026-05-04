const axios = require("axios");

const TYPES = ["waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss","lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold","nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"];

module.exports = {
  command: ["waifu", "neko", "awoo"],
  desc: "Get a random anime waifu or neko image",
  category: "Fun",
  usage: ".waifu | .neko | .awoo",
  run: async ({ command, args, trashcore, m, chat, xreply }) => {
    const type = args[0]?.toLowerCase() || command || "waifu";
    const validType = TYPES.includes(type) ? type : "waifu";
    try {
      const { data } = await axios.get(`https://api.waifu.pics/sfw/${validType}`, { timeout: 8000 });
      if (!data?.url) throw new Error("No image");
      await trashcore.sendMessage(chat, {
        image: { url: data.url },
        caption: `🌸 *${validType.toUpperCase()}* | waifu.pics`
      }, { quoted: m });
    } catch {
      try {
        const { data } = await axios.get(`https://nekos.best/api/v2/${validType}`, { timeout: 8000 });
        const imgUrl = data?.results?.[0]?.url;
        if (!imgUrl) throw new Error();
        await trashcore.sendMessage(chat, { image: { url: imgUrl }, caption: `🌸 *${validType}*` }, { quoted: m });
      } catch {
        await xreply("❌ Failed to fetch image. Try again!");
      }
    }
  }
};
