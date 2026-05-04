module.exports = {
  command: ["odds", "betodds"],
  desc: "Calculate betting odds and potential winnings",
  category: "Betting",
  usage: ".odds <stake> <odds>\nExample: .odds 100 2.5",
  run: async ({ args, xreply }) => {
    if (args.length < 2)
      return xreply("❌ Usage: .odds <stake> <odds>\nExample: .odds 100 2.5\n\nAlso try:\n.odds <decimal> — e.g. .odds 100 2.5\n.odds <fractional> — e.g. .odds 100 5/2");
    const stake = parseFloat(args[0]);
    if (isNaN(stake) || stake <= 0) return xreply("❌ Invalid stake amount.");
    let oddsVal;
    if (args[1].includes("/")) {
      const [num, den] = args[1].split("/").map(Number);
      oddsVal = num / den + 1;
    } else {
      oddsVal = parseFloat(args[1]);
    }
    if (isNaN(oddsVal) || oddsVal <= 1) return xreply("❌ Invalid odds. Must be greater than 1.0");
    const winnings = stake * oddsVal;
    const profit = winnings - stake;
    const prob = ((1 / oddsVal) * 100).toFixed(1);
    let risk;
    if (oddsVal < 1.5) risk = "🟢 Very Low";
    else if (oddsVal < 2.5) risk = "🟡 Low-Medium";
    else if (oddsVal < 5) risk = "🟠 Medium-High";
    else risk = "🔴 High Risk";
    return xreply(
      `📊 *Betting Odds Calculator*\n\n` +
      `💸 Stake: *${stake.toLocaleString()}*\n` +
      `📈 Odds: *${oddsVal.toFixed(2)}*\n\n` +
      `💰 Total Return: *${winnings.toFixed(2)}*\n` +
      `💚 Profit: *+${profit.toFixed(2)}*\n` +
      `📉 Implied Probability: *${prob}%*\n` +
      `⚠️ Risk Level: ${risk}\n\n` +
      `_⚠️ Bet responsibly. This is a calculator only._`
    );
  }
};
