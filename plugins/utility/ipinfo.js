const axios = require("axios");

module.exports = {
  command: ["ip", "ipinfo", "ipcheck"],
  desc: "Look up information about an IP address",
  category: "Utility",
  usage: ".ip <address>",
  run: async ({ args, xreply }) => {
    const address = args[0] || "";
    try {
      const url = address ? `https://ipapi.co/${address}/json/` : "https://ipapi.co/json/";
      const { data } = await axios.get(url, { timeout: 10000 });
      if (data.error) return xreply(`❌ ${data.reason || "Invalid IP address."}`);
      return xreply(
        `🌐 *IP Info*\n\n` +
        `📍 IP: *${data.ip}*\n` +
        `🌍 Country: ${data.country_name} ${data.country_flag_emoji || ""}\n` +
        `🏙️ City: ${data.city || "N/A"}\n` +
        `📍 Region: ${data.region || "N/A"}\n` +
        `🔢 ASN: ${data.asn || "N/A"}\n` +
        `🏢 ISP: ${data.org || "N/A"}\n` +
        `🕐 Timezone: ${data.timezone || "N/A"}\n` +
        `📞 Calling Code: +${data.country_calling_code || "N/A"}\n` +
        `💰 Currency: ${data.currency || "N/A"}`
      );
    } catch {
      return xreply("❌ Could not fetch IP information.");
    }
  }
};
