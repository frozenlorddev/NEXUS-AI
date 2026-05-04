module.exports = {
  command: ["fancy", "bold", "italic", "strike", "mono", "box", "spoiler"],
  desc: "Format text with WhatsApp styling",
  category: "Text",
  usage: ".bold <text> | .italic <text> | .strike <text> | .mono <text> | .box <text>",
  run: async ({ command, args, xreply }) => {
    if (!args.length) return xreply(`❌ Usage: .${command} <text>`);
    const text = args.join(" ");
    let result;
    switch (command) {
      case "bold":    result = `*${text}*`; break;
      case "italic":  result = `_${text}_`; break;
      case "strike":  result = `~${text}~`; break;
      case "mono":    result = `\`\`\`${text}\`\`\``; break;
      case "spoiler": result = `||${text}||`; break;
      case "box":
        const lines = text.split("\n");
        const maxLen = Math.max(...lines.map(l => l.length));
        const border = "─".repeat(maxLen + 2);
        result = `┌${border}┐\n${lines.map(l => `│ ${l.padEnd(maxLen)} │`).join("\n")}\n└${border}┘`;
        break;
      case "fancy":
        const MAP = {"a":"𝓪","b":"𝓫","c":"𝓬","d":"𝓭","e":"𝓮","f":"𝓯","g":"𝓰","h":"𝓱","i":"𝓲","j":"𝓳","k":"𝓴","l":"𝓵","m":"𝓶","n":"𝓷","o":"𝓸","p":"𝓹","q":"𝓺","r":"𝓻","s":"𝓼","t":"𝓽","u":"𝓾","v":"𝓿","w":"𝔀","x":"𝔁","y":"𝔂","z":"𝔃","A":"𝓐","B":"𝓑","C":"𝓒","D":"𝓓","E":"𝓔","F":"𝓕","G":"𝓖","H":"𝓗","I":"𝓘","J":"𝓙","K":"𝓚","L":"𝓛","M":"𝓜","N":"𝓝","O":"𝓞","P":"𝓟","Q":"𝓠","R":"𝓡","S":"𝓢","T":"𝓣","U":"𝓤","V":"𝓥","W":"𝓦","X":"𝓧","Y":"𝓨","Z":"𝓩"};
        result = text.split("").map(c => MAP[c] || c).join("");
        break;
      default: result = text;
    }
    return xreply(result);
  }
};
