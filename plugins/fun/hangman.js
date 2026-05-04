const WORDS = ["javascript","python","algorithm","database","network","server","browser","keyboard","monitor","software","hardware","internet","programming","developer","function","variable","boolean","integer","string","array","object","method","class","module","package","library","framework","interface","database","encryption","javascript","typescript","nodejs","express","mongodb","postgres","docker","linux","android","blockchain","artificial","intelligence","machine","learning","neural","network","cryptocurrency","bitcoin","ethereum"];
const games = new Map();
const STAGES = ["😃","😐","😟","😨","😰","😱","💀"];
function display(word, guessed) { return word.split("").map(c => guessed.has(c) ? c : "_").join(" "); }

module.exports = {
  command: ["hangman", "hm"],
  desc: "Play Hangman! Guess the word letter by letter.",
  category: "Fun",
  usage: ".hangman — start | .hm <letter> — guess",
  run: async ({ command, args, chat, sender, xreply }) => {
    const key = `${chat}_${sender}`;
    if (!args.length || command === "hangman") {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      games.set(key, { word, guessed: new Set(), wrong: 0 });
      return xreply(`🎮 *Hangman Started!*\n\nWord: \`${display(word, new Set())}\`\n📏 Length: ${word.length} letters\n\n_Guess a letter: .hm <letter>_\n\n${STAGES[0]} Lives: 6`);
    }
    const g = games.get(key);
    if (!g) return xreply("❌ No active game. Start with .hangman");
    const letter = args[0].toLowerCase()[0];
    if (!letter || !/[a-z]/.test(letter)) return xreply("❌ Please guess a single letter a-z.");
    if (g.guessed.has(letter)) return xreply(`❌ You already guessed *${letter}*! Try a different letter.`);
    g.guessed.add(letter);
    if (!g.word.includes(letter)) {
      g.wrong++;
      if (g.wrong >= 6) {
        games.delete(key);
        return xreply(`${STAGES[6]} *GAME OVER!*\nThe word was: *${g.word}*\nPlay again with .hangman`);
      }
      return xreply(`❌ *${letter}* is not in the word!\n\n${STAGES[g.wrong]} Lives: ${6-g.wrong}\nWord: \`${display(g.word, g.guessed)}\`\nGuessed: ${[...g.guessed].join(", ")}`);
    }
    const shown = display(g.word, g.guessed);
    if (!shown.includes("_")) {
      games.delete(key);
      return xreply(`🎉 *YOU WIN!*\nWord: *${g.word}*\nGuesses: ${g.guessed.size} | Wrong: ${g.wrong}`);
    }
    return xreply(`✅ *${letter}* is in the word!\n\n${STAGES[g.wrong]} Lives: ${6-g.wrong}\nWord: \`${shown}\`\nGuessed: ${[...g.guessed].join(", ")}`);
  }
};
