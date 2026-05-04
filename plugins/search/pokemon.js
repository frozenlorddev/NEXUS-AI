const axios = require("axios");

module.exports = {
  command: ["pokemon", "poke", "pokedex"],
  desc: "Get Pokémon information from the Pokédex",
  category: "Search",
  usage: ".pokemon <name or number>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("⚡ Usage: .pokemon <name or number>\nExample: .pokemon pikachu");
    const query = args[0].toLowerCase();
    try {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`, { timeout: 10000 });
      const specRes = await axios.get(data.species.url, { timeout: 10000 }).catch(() => ({ data: {} }));
      const desc = specRes.data?.flavor_text_entries?.find(e => e.language.name === "en")?.flavor_text?.replace(/\n|\f/g, " ") || "";
      const stats = data.stats.map(s => `${s.stat.name}: *${s.base_stat}*`).join(" | ");
      const types = data.types.map(t => t.type.name).join(" / ");
      const abilities = data.abilities.map(a => a.ability.name).join(", ");
      const imgUrl = data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default;
      const text =
        `⚡ *#${data.id} ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}*\n` +
        `🏷️ Type: *${types}*\n` +
        `📏 Height: ${data.height / 10}m | ⚖️ Weight: ${data.weight / 10}kg\n` +
        `✨ Abilities: ${abilities}\n\n` +
        `📊 *Base Stats:*\n${stats}\n\n` +
        `📖 ${desc}`;
      if (imgUrl) {
        await trashcore.sendMessage(chat, { image: { url: imgUrl }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      await xreply("❌ Pokémon not found. Try a name or number like .pokemon 25");
    }
  }
};
