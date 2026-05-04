const axios = require("axios");

module.exports = {
  command: ["crypto", "cryptoprice", "btc", "eth", "tokenprice"],
  desc: "Get cryptocurrency prices",
  category: "Search",
  usage: ".crypto <coin> | .btc | .eth",
  run: async ({ command, args, xreply }) => {
    let query;
    if (command === "btc") query = "bitcoin";
    else if (command === "eth") query = "ethereum";
    else query = args.join(" ") || "bitcoin";
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
        { timeout: 10000 }
      );
      const coin = data?.coins?.[0];
      if (!coin) return xreply(`❌ Coin "${query}" not found.`);
      const { data: price } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true`,
        { timeout: 10000 }
      );
      const p = price[coin.id];
      const change = p?.usd_24h_change?.toFixed(2) || 0;
      const arrow = change > 0 ? "📈" : "📉";
      return xreply(
        `🪙 *${coin.name} (${coin.symbol?.toUpperCase()})*\n\n` +
        `💵 Price: *$${p?.usd?.toLocaleString()}*\n` +
        `💶 EUR: *€${p?.eur?.toLocaleString()}*\n` +
        `${arrow} 24h Change: *${change}%*\n` +
        `💰 Market Cap: *$${(p?.usd_market_cap / 1e9).toFixed(2)}B*\n\n` +
        `🔗 Powered by CoinGecko`
      );
    } catch {
      return xreply("❌ Failed to fetch crypto price. Please try again.");
    }
  }
};
