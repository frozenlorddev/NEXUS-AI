module.exports = {
  command: ["broadcast", "bc"],
  desc: "Broadcast a message to all known chats (owner only)",
  category: "Owner",
  usage: ".broadcast <message>",
  isOwner: true,
  run: async ({ trashcore, m, args, isOwner, xreply }) => {
    if (!isOwner) return xreply("❌ Only the bot owner can use this command.");
    if (!args.length) return xreply("❌ Usage: .broadcast <message>\nExample: .broadcast Bot will restart in 5 mins.");
    const msg = args.join(" ");
    const chats = Object.keys(trashcore.store?.chats?.all?.() || {});
    if (!chats.length) {
      return xreply("⚠️ No chats found to broadcast to.");
    }
    await xreply(`📢 Broadcasting to ${chats.length} chat(s)...`);
    let sent = 0, failed = 0;
    for (const chatId of chats) {
      try {
        await trashcore.sendMessage(chatId, { text: `📢 *Broadcast*\n\n${msg}` });
        sent++;
        await new Promise(r => setTimeout(r, 500));
      } catch { failed++; }
    }
    await xreply(`✅ Broadcast complete!\n📤 Sent: ${sent}\n❌ Failed: ${failed}`);
  }
};
