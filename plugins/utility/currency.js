const axios = require("axios");

module.exports = {
  command: ["currency", "convert", "fx"],
  desc: "Convert currency amounts",
  category: "Utility",
  usage: ".currency <amount> <from> <to>\nExample: .currency 100 USD KES",
  run: async ({ args, xreply }) => {
    if (args.length < 3)
      return xreply("❌ Usage: .currency <amount> <from> <to>\nExample: .currency 100 USD KES");
    const amount = parseFloat(args[0]);
    const from   = args[1].toUpperCase();
    const to     = args[2].toUpperCase();
    if (isNaN(amount) || amount <= 0) return xreply("❌ Invalid amount.");
    try {
      const { data } = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${from}`,
        { timeout: 10000 }
      );
      const rate = data.rates?.[to];
      if (!rate) return xreply(`❌ Unsupported currency: ${to}\nCheck currency codes (e.g., USD, EUR, KES, NGN).`);
      const converted = (amount * rate).toFixed(2);
      return xreply(`💱 *Currency Converter*\n\n${amount} ${from} = *${converted} ${to}*\n\n📊 Rate: 1 ${from} = ${rate.toFixed(4)} ${to}`);
    } catch {
      return xreply("❌ Could not fetch exchange rates. Please try again.");
    }
  }
};
