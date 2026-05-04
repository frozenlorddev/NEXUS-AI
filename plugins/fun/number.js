const activeGames = new Map();

module.exports = {
  command: ["numguess", "guess"],
  desc: "Play a number guessing game (1-100)",
  category: "Fun",
  usage: ".numguess — start | .guess <number> — guess",
  run: async ({ chat, sender, args, command, xreply }) => {
    if (command === "numguess") {
      const secret = Math.floor(Math.random() * 100) + 1;
      activeGames.set(`${chat}_${sender}`, { secret, attempts: 0 });
      return xreply("🎮 *Number Guessing Game*\n\nI'm thinking of a number between 1 and 100.\nType *.guess <number>* to make a guess!\n\nYou have 7 attempts. Good luck! 🍀");
    }
    const game = activeGames.get(`${chat}_${sender}`);
    if (!game) return xreply("❌ No active game. Start one with *.numguess*");
    const guess = parseInt(args[0]);
    if (isNaN(guess) || guess < 1 || guess > 100) return xreply("❌ Please guess a number between 1 and 100.");
    game.attempts++;
    if (guess === game.secret) {
      activeGames.delete(`${chat}_${sender}`);
      return xreply(`🎉 *Correct!* The number was *${game.secret}*!\nYou got it in *${game.attempts}* attempt${game.attempts !== 1 ? "s" : ""}!`);
    }
    if (game.attempts >= 7) {
      activeGames.delete(`${chat}_${sender}`);
      return xreply(`😞 *Game Over!*\nThe number was *${game.secret}*. Better luck next time!\nType *.numguess* to play again.`);
    }
    const hint = guess < game.secret ? "📈 Higher!" : "📉 Lower!";
    const remaining = 7 - game.attempts;
    return xreply(`${hint} Guess: *${guess}*\n${remaining} attempt${remaining !== 1 ? "s" : ""} left.`);
  }
};
