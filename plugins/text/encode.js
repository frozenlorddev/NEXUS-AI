module.exports = {
  command: ["binary", "morse", "caesar", "demorseode", "debinary"],
  desc: "Encode/decode text in binary, morse, or caesar cipher",
  category: "Text",
  usage: ".binary <text> | .morse <text> | .caesar <shift> <text>",
  run: async ({ command, args, xreply }) => {
    if (!args.length) return xreply(`❌ Usage: .${command} <text>`);
    const MORSE = { A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----." };
    const RMORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]));
    if (command === "binary") {
      const result = args.join(" ").split("").map(c => c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");
      return xreply(`🔢 *Binary*\n\n${result}`);
    }
    if (command === "debinary") {
      try {
        const result = args.join(" ").trim().split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
        return xreply(`📝 *Decoded Binary*\n\n${result}`);
      } catch { return xreply("❌ Invalid binary string."); }
    }
    if (command === "morse") {
      const result = args.join(" ").toUpperCase().split("").map(c => c === " " ? "/" : MORSE[c] || c).join(" ");
      return xreply(`📡 *Morse Code*\n\n${result}`);
    }
    if (command === "demorseode") {
      const result = args.join(" ").split(" / ").map(word => word.split(" ").map(s => RMORSE[s] || s).join("")).join(" ");
      return xreply(`📝 *Decoded Morse*\n\n${result}`);
    }
    if (command === "caesar") {
      const shift = parseInt(args[0]);
      if (isNaN(shift)) return xreply("❌ Usage: .caesar <shift> <text>\nExample: .caesar 13 Hello");
      const text = args.slice(1).join(" ");
      const result = text.split("").map(c => {
        if (/[a-zA-Z]/.test(c)) {
          const base = c <= "Z" ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
        }
        return c;
      }).join("");
      return xreply(`🔐 *Caesar Cipher (shift ${shift})*\n\n${result}`);
    }
  }
};
