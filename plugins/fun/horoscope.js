const axios = require("axios");

const SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
const SIGN_EMOJIS = { aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpio:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓" };
const DATES = { aries:"Mar 21–Apr 19",taurus:"Apr 20–May 20",gemini:"May 21–Jun 20",cancer:"Jun 21–Jul 22",leo:"Jul 23–Aug 22",virgo:"Aug 23–Sep 22",libra:"Sep 23–Oct 22",scorpio:"Oct 23–Nov 21",sagittarius:"Nov 22–Dec 21",capricorn:"Dec 22–Jan 19",aquarius:"Jan 20–Feb 18",pisces:"Feb 19–Mar 20" };

module.exports = {
  command: ["horoscope", "zodiac", "star"],
  desc: "Get your daily horoscope reading",
  category: "Fun",
  usage: ".horoscope <sign>",
  run: async ({ args, xreply }) => {
    if (!args.length) {
      const list = SIGNS.map(s => `${SIGN_EMOJIS[s]} ${s}`).join("  |  ");
      return xreply(`♈ *Horoscope Signs*\n\n${list}\n\nUsage: .horoscope <sign>\nExample: .horoscope leo`);
    }
    const sign = args[0].toLowerCase();
    if (!SIGNS.includes(sign)) return xreply(`❌ Unknown sign. Valid signs:\n${SIGNS.join(", ")}`);
    try {
      const { data } = await axios.post(
        `https://aztro.sameerkumar.website/?sign=${sign}&day=today`,
        {}, { timeout: 10000 }
      );
      return xreply(
        `${SIGN_EMOJIS[sign]} *${sign.toUpperCase()}* — Daily Horoscope\n` +
        `📅 ${data.current_date}\n` +
        `🗓️ ${DATES[sign]}\n\n` +
        `📖 *Reading:*\n${data.description}\n\n` +
        `🎨 Lucky Color: *${data.color}*\n` +
        `🔢 Lucky Number: *${data.lucky_number}*\n` +
        `🌅 Mood: *${data.mood}*\n` +
        `💫 Compatibility: *${data.compatibility}*`
      );
    } catch {
      const readings = [
        "The stars align in your favor today. Trust your instincts and make bold decisions.",
        "A day for reflection. Slow down and appreciate the small things around you.",
        "Exciting energy surrounds you. New opportunities are about to knock on your door.",
        "Focus on your relationships today. Someone close to you needs your attention.",
        "Financial matters require care. Be thoughtful about your spending decisions.",
      ];
      const lucky = Math.floor(Math.random() * 99) + 1;
      return xreply(
        `${SIGN_EMOJIS[sign]} *${sign.toUpperCase()}* — Daily Horoscope\n` +
        `🗓️ ${DATES[sign]}\n\n` +
        `📖 ${readings[Math.floor(Math.random() * readings.length)]}\n\n` +
        `🔢 Lucky Number: *${lucky}*\n` +
        `🌅 Mood: *${["Happy","Focused","Creative","Calm","Energetic"][Math.floor(Math.random()*5)]}*`
      );
    }
  }
};
