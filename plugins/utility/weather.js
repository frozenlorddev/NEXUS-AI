const axios = require("axios");

module.exports = {
  command: ["weather", "w"],
  desc: "Get current weather for a city",
  category: "Utility",
  usage: ".weather <city>",
  run: async ({ args, xreply }) => {
    if (!args.length) return xreply("❌ Usage: .weather <city>\nExample: .weather Nairobi");
    const city = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
        { timeout: 10000 }
      );
      const w   = data.current_condition[0];
      const loc = data.nearest_area[0];
      const name = loc.areaName[0].value + ", " + loc.country[0].value;
      const temp_c  = w.temp_C;
      const temp_f  = w.temp_F;
      const feels_c = w.FeelsLikeC;
      const humidity = w.humidity;
      const wind    = w.windspeedKmph;
      const desc    = w.weatherDesc[0].value;
      const vis     = w.visibility;
      return xreply(
        `🌍 *Weather — ${name}*\n\n` +
        `🌡️ Temp: ${temp_c}°C / ${temp_f}°F\n` +
        `🤔 Feels Like: ${feels_c}°C\n` +
        `🌤️ Condition: ${desc}\n` +
        `💧 Humidity: ${humidity}%\n` +
        `💨 Wind: ${wind} km/h\n` +
        `👁️ Visibility: ${vis} km`
      );
    } catch {
      return xreply("❌ Could not fetch weather. Check the city name and try again.");
    }
  }
};
