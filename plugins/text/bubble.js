module.exports = {
  command: ["bubble", "circle", "square", "smallcaps"],
  desc: "Convert text to bubble/circle/square characters",
  category: "Text",
  usage: ".bubble <text> | .circle <text> | .square <text> | .smallcaps <text>",
  run: async ({ command, args, xreply }) => {
    if (!args.length) return xreply(`❌ Usage: .${command} <text>`);
    const text = args.join(" ");
    const BUBBLE_L = "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ";
    const BUBBLE_U = "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ";
    const SQUARE_L = "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉";
    const SMALL   = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀsᴛᴜᴠᴡxʏᴢ";
    let result;
    if (command === "bubble") {
      result = text.split("").map(c => {
        const i = c.toLowerCase().charCodeAt(0) - 97;
        if (i >= 0 && i < 26) return c === c.toUpperCase() ? BUBBLE_U[i] : BUBBLE_L[i];
        return c;
      }).join("");
    } else if (command === "circle") {
      result = text.split("").map(c => {
        const i = c.toLowerCase().charCodeAt(0) - 97;
        return (i >= 0 && i < 26) ? BUBBLE_L[i] : c;
      }).join("");
    } else if (command === "square") {
      result = text.toUpperCase().split("").map(c => {
        const i = c.charCodeAt(0) - 65;
        return (i >= 0 && i < 26) ? SQUARE_L[i] : c;
      }).join("");
    } else if (command === "smallcaps") {
      result = text.toLowerCase().split("").map(c => {
        const i = c.charCodeAt(0) - 97;
        return (i >= 0 && i < 26) ? SMALL[i] : c;
      }).join("");
    }
    return xreply(`✨ *${command}*\n\n${result}`);
  }
};
