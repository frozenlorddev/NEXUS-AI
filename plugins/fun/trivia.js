const axios = require("axios");
const activeTrivia = new Map();

module.exports = {
  command: ["trivia", "quiz"],
  desc: "Answer a trivia question",
  category: "Fun",
  usage: ".trivia — get question | .trivia <a|b|c|d> — answer",
  run: async ({ chat, sender, args, xreply }) => {
    const key = `${chat}_${sender}`;
    if (!args.length || activeTrivia.has(key)) {
      if (activeTrivia.has(key) && args.length) {
        const q = activeTrivia.get(key);
        const ans = args[0].toLowerCase();
        const letters = ["a", "b", "c", "d"];
        const idx = letters.indexOf(ans);
        if (idx === -1) return xreply("❌ Answer with a, b, c, or d.\nExample: .trivia a");
        activeTrivia.delete(key);
        const chosen = q.options[idx];
        if (chosen === q.correct) {
          return xreply(`✅ *Correct!* 🎉\n\n${q.correct} is right!\n\n_${q.explanation || ""}_`);
        } else {
          return xreply(`❌ *Wrong!*\nYou chose: ${chosen}\nCorrect answer: *${q.correct}*`);
        }
      }
      try {
        const { data } = await axios.get(
          "https://opentdb.com/api.php?amount=1&type=multiple",
          { timeout: 10000 }
        );
        const r = data.results[0];
        const correct = r.correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");
        const wrong = r.incorrect_answers.map(a => a.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"));
        const options = [...wrong, correct].sort(() => Math.random() - 0.5);
        activeTrivia.set(key, { correct, options, explanation: "" });
        setTimeout(() => activeTrivia.delete(key), 60000);
        const q = r.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");
        const letters = ["a", "b", "c", "d"];
        let text = `🧠 *Trivia* (${r.category})\n_${r.difficulty}_\n\n❓ ${q}\n\n`;
        options.forEach((o, i) => { text += `*${letters[i]}.* ${o}\n`; });
        text += "\nReply with .trivia <a/b/c/d>";
        return xreply(text);
      } catch {
        return xreply("❌ Could not fetch trivia. Try again!");
      }
    }
    return xreply("❓ You have an active trivia question! Answer it or wait for it to expire.\nExample: .trivia a");
  }
};
