const axios = require("axios");

module.exports = {
  command: ["translate", "tr"],
  desc: "Translate text to another language",
  category: "Utility",
  usage: ".translate <lang_code> <text>\nExample: .translate es Hello world",
  run: async ({ args, xreply }) => {
    if (args.length < 2)
      return xreply("❌ Usage: .translate <lang_code> <text>\nExample: .translate es Hello world\n\nCommon codes: en, es, fr, de, ar, zh, hi, pt, ru, ja, ko, sw");
    const lang = args[0].toLowerCase();
    const text = args.slice(1).join(" ");
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`;
      const { data } = await axios.get(url, { timeout: 10000 });
      if (data.responseStatus !== 200) throw new Error("API error");
      const translated = data.responseData.translatedText;
      return xreply(`🌐 *Translation*\n\n📝 Original: ${text}\n🗣️ Translated (${lang}): ${translated}`);
    } catch {
      return xreply("❌ Translation failed. Check the language code and try again.");
    }
  }
};
