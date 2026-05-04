const axios = require("axios");

module.exports = {
  command: ["color", "hex", "colour"],
  desc: "Get info about a color or generate a random one",
  category: "Utility",
  usage: ".color <hex> | .color random",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    let hex = args[0]?.replace("#", "") || Math.floor(Math.random()*16777215).toString(16).padStart(6,"0");
    if (!/^[0-9a-fA-F]{3,8}$/.test(hex)) return xreply("❌ Invalid hex color. Example: .color FF5733 or .color random");
    hex = hex.padEnd(6, "0").slice(0, 6).toUpperCase();
    try {
      const imgUrl = `https://singlecolorimage.com/get/${hex}/200x200`;
      const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      const lum = brightness > 128 ? "Light" : "Dark";
      const h = Math.round(Math.atan2(Math.sqrt(3)*(g-b), 2*r-g-b) * 180 / Math.PI);
      const text =
        `🎨 *Color Info*\n\n` +
        `🔵 HEX: *#${hex}*\n` +
        `🔴 RGB: *rgb(${r}, ${g}, ${b})*\n` +
        `✨ Brightness: *${lum}*\n` +
        `📊 Hue: *${h}°*`;
      await trashcore.sendMessage(chat, { image: { url: imgUrl }, caption: text }, { quoted: m });
    } catch {
      const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
      await xreply(`🎨 *Color: #${hex}*\nRGB: rgb(${r}, ${g}, ${b})`);
    }
  }
};
