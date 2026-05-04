const WORDS = ["elephant","programming","javascript","database","keyboard","network","satellite","helicopter","butterfly","adventure","chocolate","strawberry","computer","telephone","lightning","hurricane","university","photography","basketball","apartment","celebrity","environment","technology","population","government","dictionary","conversation","information","experiment","vocabulary"];
const games = new Map();
function scramble(word) {
  let arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("") === word ? scramble(word) : arr.join("");
}

module.exports = {
  command: ["wordscramble", "unscramble", "ws"],
  desc: "Unscramble the word before time runs out!",
  category: "Fun",
  usage: ".wordscramble — start | .ws <answer>",
  run: async ({ command, args, chat, sender, xreply }) => {
    const key = `${chat}_${sender}`;
    if (args.length > 0 && command === "ws") {
      const g = games.get(key);
      if (!g) return xreply("❌ No active game. Start with .wordscramble");
      const guess = args.join("").toLowerCase().trim();
      if (guess === g.word) {
        games.delete(key);
        return xreply(`✅ *Correct!* 🎉\nThe word was: *${g.word}*`);
      }
      return xreply(`❌ Wrong! The scrambled word is: \`${g.scrambled}\`\n_Try again!_`);
    }
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const scrambled = scramble(word);
    games.set(key, { word, scrambled });
    setTimeout(() => {
      if (games.get(key)?.word === word) {
        games.delete(key);
      }
    }, 60000);
    return xreply(`🔤 *Word Scramble!*\n\nUnscramble: \`${scrambled}\`\n📏 ${word.length} letters\n\n_Answer with .ws <word> (60 sec)_`);
  }
};
