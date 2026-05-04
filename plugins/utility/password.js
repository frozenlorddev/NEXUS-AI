module.exports = {
  command: ["password", "passwd", "genpass"],
  desc: "Generate a secure random password",
  category: "Utility",
  usage: ".password [length] [options: upper|lower|num|sym]",
  run: async ({ args, xreply }) => {
    const len = Math.min(Math.max(parseInt(args[0]) || 16, 6), 64);
    const useUpper  = !args.includes("nolower") && true;
    const useLower  = !args.includes("noupper") && true;
    const useNums   = !args.includes("nonum") && true;
    const useSyms   = args.includes("sym") || args.includes("symbols");
    let chars = "";
    if (useLower)  chars += "abcdefghijklmnopqrstuvwxyz";
    if (useUpper)  chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNums)   chars += "0123456789";
    if (useSyms)   chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const pwd = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const strength = len >= 20 && useSyms && useNums ? "🟢 Very Strong" : len >= 14 && useNums ? "🟡 Strong" : len >= 10 ? "🟠 Medium" : "🔴 Weak";
    return xreply(`🔐 *Generated Password*\n\n\`\`\`${pwd}\`\`\`\n\n📏 Length: ${len}\n💪 Strength: ${strength}\n\n_⚠️ Never share your password!_`);
  }
};
