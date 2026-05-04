module.exports = {
  command: ["8ball", "magic8"],
  desc: "Ask the magic 8-ball a yes/no question",
  category: "Fun",
  usage: ".8ball <question>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("🎱 Please ask a question!\nExample: .8ball Will I be rich?");
    const responses = [
      "✅ It is certain.",
      "✅ It is decidedly so.",
      "✅ Without a doubt.",
      "✅ Yes, definitely.",
      "✅ You may rely on it.",
      "✅ As I see it, yes.",
      "✅ Most likely.",
      "✅ Outlook good.",
      "✅ Yes.",
      "✅ Signs point to yes.",
      "🤷 Reply hazy, try again.",
      "🤷 Ask again later.",
      "🤷 Better not tell you now.",
      "🤷 Cannot predict now.",
      "🤷 Concentrate and ask again.",
      "❌ Don't count on it.",
      "❌ My reply is no.",
      "❌ My sources say no.",
      "❌ Outlook not so good.",
      "❌ Very doubtful.",
    ];
    const q = args.join(" ");
    const answer = responses[Math.floor(Math.random() * responses.length)];
    return xreply(`🎱 *Magic 8-Ball*\n\n❓ ${q}\n\n${answer}`);
  }
};
