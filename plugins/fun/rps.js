module.exports = {
  command: ["rps"],
  desc: "Play Rock Paper Scissors",
  category: "Fun",
  usage: ".rps <rock|paper|scissors>",
  run: async ({ args, xreply }) => {
    const choices = ["rock", "paper", "scissors"];
    const emojis  = { rock: "🪨", paper: "📄", scissors: "✂️" };
    const player = args[0]?.toLowerCase();
    if (!choices.includes(player))
      return xreply("❌ Choose: rock, paper, or scissors\nExample: .rps rock");
    const bot = choices[Math.floor(Math.random() * 3)];
    let result;
    if (player === bot)         result = "🤝 *It's a tie!*";
    else if (
      (player === "rock"     && bot === "scissors") ||
      (player === "paper"    && bot === "rock")     ||
      (player === "scissors" && bot === "paper")
    ) result = "🏆 *You win!*";
    else result = "😈 *Bot wins!*";
    return xreply(`✊✌️🖐️ *Rock Paper Scissors*\n\nYou: ${emojis[player]} ${player}\nBot: ${emojis[bot]} ${bot}\n\n${result}`);
  }
};
