const axios = require("axios");

module.exports = {
  command: ["define", "dict", "meaning"],
  desc: "Get dictionary definition of a word",
  category: "Utility",
  usage: ".define <word>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .define <word>\nExample: .define serendipity");
    const word = args[0].toLowerCase();
    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 10000 });
      const entry = data[0];
      let text = `📚 *${entry.word}*\n`;
      if (entry.phonetic) text += `🔊 ${entry.phonetic}\n`;
      text += "\n";
      entry.meanings.slice(0, 3).forEach(m => {
        text += `*${m.partOfSpeech}*\n`;
        m.definitions.slice(0, 2).forEach((d, i) => {
          text += `${i + 1}. ${d.definition}\n`;
          if (d.example) text += `   _"${d.example}"_\n`;
        });
        text += "\n";
      });
      if (entry.meanings[0]?.synonyms?.length) {
        text += `🔄 Synonyms: ${entry.meanings[0].synonyms.slice(0, 5).join(", ")}`;
      }
      return xreply(text.trim());
    } catch {
      return xreply(`❌ No definition found for "${args[0]}".`);
    }
  }
};
