const { getMarriage, addMarriage, removeMarriage } = require("../../database");

module.exports = {
  command: ["marry", "divorce", "partner", "spouse"],
  desc: "Marry or divorce another user, or check your partner",
  category: "Social",
  usage: ".marry @user | .divorce | .partner",
  run: async ({ command, m, sender, xreply }) => {
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const targetNum = target?.split("@")[0];
    if (command === "partner" || command === "spouse") {
      const marriage = getMarriage(sender);
      if (!marriage) return xreply("💔 You are not married.\nUse .marry @user to propose!");
      const partner = marriage.user1 === sender ? marriage.user2 : marriage.user1;
      const since = new Date(Number(marriage.married_at) * 1000).toLocaleDateString("en-GB");
      return xreply(`💑 *Your Partner*\n\n❤️ Married to: @${partner}\n📅 Since: ${since}`);
    }
    if (command === "divorce") {
      const marriage = getMarriage(sender);
      if (!marriage) return xreply("💔 You're not married!");
      const partner = marriage.user1 === sender ? marriage.user2 : marriage.user1;
      removeMarriage(sender);
      return xreply(`💔 *Divorced*\nYou and @${partner} are now separated. 😢`);
    }
    if (command === "marry") {
      if (!target) return xreply("❌ Usage: .marry @user");
      if (targetNum === sender) return xreply("❌ You can't marry yourself!");
      const existingA = getMarriage(sender);
      if (existingA) {
        const myPartner = existingA.user1 === sender ? existingA.user2 : existingA.user1;
        return xreply(`❌ You're already married to @${myPartner}! Divorce first with .divorce`);
      }
      const existingB = getMarriage(targetNum);
      if (existingB) return xreply(`❌ @${targetNum} is already married to someone else!`);
      addMarriage(sender, targetNum);
      return xreply(
        `💍 *Congratulations!*\n\n` +
        `@${sender} and @${targetNum} are now married! 🎉❤️\n\n` +
        `May your love last forever! 💑`,
        { mentions: [`${sender}@s.whatsapp.net`, target] }
      );
    }
  }
};
