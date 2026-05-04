const axios = require("axios");

module.exports = {
  command: ["dictionary", "wordinfo", "wordlookup"],
  desc: "Look up the definition of any English word",
  category: "Search",
  usage: ".dict <word>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("📖 Usage: .dict <word>\nExample: .dict eloquent");
    const word = args[0].toLowerCase();
    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { timeout: 10000 });
      const entry = data[0];
      const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || "";
      let text = `📖 *${entry.word}* ${phonetic ? `_${phonetic}_` : ""}\n\n`;
      entry.meanings?.slice(0, 3).forEach((m, i) => {
        text += `*${m.partOfSpeech}:*\n`;
        m.definitions?.slice(0, 2).forEach((d, j) => {
          text += `${j+1}. ${d.definition}\n`;
          if (d.example) text += `   _"${d.example}"_\n`;
        });
        if (m.synonyms?.length) text += `Synonyms: ${m.synonyms.slice(0, 4).join(", ")}\n`;
        text += "\n";
      });
      return xreply(text.trim());
    } catch {
      return xreply(`❌ Word "${args[0]}" not found in dictionary.`);
    }
  }
};
