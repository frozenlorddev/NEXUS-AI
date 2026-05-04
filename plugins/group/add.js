module.exports = {
  command: ["add"],
  desc: "Add a member to the group",
  category: "Group",
  usage: ".add <number>",
  run: async ({ trashcore, chat, args, isOwner, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    if (!isOwner) return xreply("⚠️ Only the bot owner can use this command.");
    if (!args[0]) return xreply("❌ Usage: .add <number>\nExample: .add 254712345678");
    const number = args[0].replace(/\D/g, "");
    if (!number) return xreply("❌ Invalid phone number.");
    const jid = `${number}@s.whatsapp.net`;
    try {
      const result = await trashcore.groupParticipantsUpdate(chat, [jid], "add");
      const status = result?.[0]?.status;
      if (status === 200 || status === 408) {
        return xreply(`✅ Successfully added @${number}`, { mentions: [jid] });
      } else if (status === 403) {
        return xreply(`❌ ${number} has their privacy settings restricting being added to groups.`);
      } else if (status === 404) {
        return xreply(`❌ ${number} is not on WhatsApp.`);
      } else {
        return xreply(`⚠️ Could not add ${number}. Status: ${status}`);
      }
    } catch {
      return xreply("❌ Failed to add member. Ensure the bot is an admin.");
    }
  }
};
