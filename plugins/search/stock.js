const axios = require("axios");

module.exports = {
  command: ["stock", "stocks", "stonks"],
  desc: "Get stock market information",
  category: "Search",
  usage: ".stock <symbol>  e.g. .stock AAPL",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("📈 Usage: .stock <symbol>\nExample: .stock AAPL | .stock TSLA | .stock MSFT");
    const symbol = args[0].toUpperCase();
    try {
      const { data } = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
        { timeout: 10000, headers: { "User-Agent": "Mozilla/5.0" } }
      );
      const result = data?.chart?.result?.[0];
      if (!result) return xreply(`❌ Stock "${symbol}" not found. Try a valid ticker like AAPL, TSLA, MSFT.`);
      const meta = result.meta;
      const price = meta.regularMarketPrice;
      const prev = meta.chartPreviousClose || meta.previousClose;
      const change = price - prev;
      const changePct = ((change / prev) * 100).toFixed(2);
      const arrow = change >= 0 ? "📈" : "📉";
      const currency = meta.currency || "USD";
      return xreply(
        `📊 *${meta.symbol} — ${meta.shortName || symbol}*\n\n` +
        `💵 Price: *${currency} ${price?.toFixed(2)}*\n` +
        `${arrow} Change: *${change >= 0 ? "+" : ""}${change?.toFixed(2)} (${change >= 0 ? "+" : ""}${changePct}%)*\n` +
        `📊 Open: ${meta.regularMarketOpen?.toFixed(2)}\n` +
        `📈 High: ${meta.regularMarketDayHigh?.toFixed(2)}\n` +
        `📉 Low: ${meta.regularMarketDayLow?.toFixed(2)}\n` +
        `💹 Volume: ${meta.regularMarketVolume?.toLocaleString()}\n` +
        `🏛️ Market: ${meta.exchangeName || "N/A"}\n\n` +
        `_Powered by Yahoo Finance_`
      );
    } catch {
      return xreply("❌ Failed to fetch stock data. Try a valid ticker symbol.");
    }
  }
};
