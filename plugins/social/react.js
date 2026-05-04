const axios = require("axios");

const REACTIONS = {
  hug:       { emoji: "🤗", text: "hugs", api: "https://nekos.best/api/v2/hug" },
  kiss:      { emoji: "😘", text: "kisses", api: "https://nekos.best/api/v2/kiss" },
  slap:      { emoji: "👋", text: "slaps", api: "https://nekos.best/api/v2/slap" },
  pat:       { emoji: "🤚", text: "pats", api: "https://nekos.best/api/v2/pat" },
  poke:      { emoji: "👉", text: "pokes", api: "https://nekos.best/api/v2/poke" },
  cuddle:    { emoji: "🤗", text: "cuddles", api: "https://nekos.best/api/v2/cuddle" },
  bite:      { emoji: "😬", text: "bites", api: "https://nekos.best/api/v2/bite" },
  punch:     { emoji: "👊", text: "punches", api: "https://nekos.best/api/v2/punch" },
  wave:      { emoji: "👋", text: "waves at", api: "https://nekos.best/api/v2/wave" },
  highfive:  { emoji: "🙌", text: "high fives", api: "https://nekos.best/api/v2/highfive" },
  dance:     { emoji: "💃", text: "dances with", api: "https://nekos.best/api/v2/dance" },
  blush:     { emoji: "😊", text: "blushes at", api: "https://nekos.best/api/v2/blush" },
  smile:     { emoji: "😊", text: "smiles at", api: "https://nekos.best/api/v2/smile" },
  shoot:     { emoji: "🔫", text: "shoots", api: null },
  baka:      { emoji: "😤", text: "calls baka at", api: "https://nekos.best/api/v2/baka" },
  kick:      { emoji: "🦵", text: "kicks", api: "https://nekos.best/api/v2/kick" },
};

module.exports = {
  command: Object.keys(REACTIONS),
  desc: "Social reaction commands (hug, kiss, slap, pat, poke, etc.)",
  category: "Social",
  usage: ".hug @user | .kiss @user | .slap @user ...",
  run: async ({ command, m, sender, trashcore, chat, xreply }) => {
    const reaction = REACTIONS[command];
    if (!reaction) return;
    const target =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant;
    const targetDisplay = target ? `@${target.split("@")[0]}` : "everyone";
    const caption = `${reaction.emoji} *@${sender}* ${reaction.text} ${targetDisplay}`;
    const mentions = [target, `${sender}@s.whatsapp.net`].filter(Boolean);
    try {
      if (reaction.api) {
        const { data } = await axios.get(reaction.api, { timeout: 8000 });
        const gifUrl = data?.results?.[0]?.url || data?.url;
        if (gifUrl) {
          await trashcore.sendMessage(chat, { image: { url: gifUrl }, caption }, { quoted: m });
          return;
        }
      }
    } catch {}
    await xreply(caption, { mentions });
  }
};
