module.exports = {
  command: ["poll"],
  desc: "Create a simple poll in the group",
  category: "Utility",
  usage: '.poll "Question" | option1 | option2 | ...',
  run: async ({ trashcore, chat, text, xreply }) => {
    if (!text || !text.includes("|"))
      return xreply('❌ Usage: .poll "Question" | option1 | option2\nExample: .poll Favorite color? | Red | Blue | Green');
    const parts = text.split("|").map(s => s.trim()).filter(Boolean);
    if (parts.length < 3) return xreply("❌ Need a question and at least 2 options.");
    const question = parts[0];
    const options = parts.slice(1, 13);
    const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🇦","🇧"];
    const optionText = options.map((o, i) => `${emojis[i]} ${o}`).join("\n");
    await trashcore.sendMessage(chat, {
      text: `📊 *POLL*\n\n❓ ${question}\n\n${optionText}\n\nReact or reply with the number to vote!`
    });
  }
};
