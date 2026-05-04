module.exports = {
  command: ["remind", "reminder"],
  desc: "Set a reminder (up to 60 minutes)",
  category: "Utility",
  usage: ".remind <minutes> <message>\nExample: .remind 5 Check the oven",
  run: async ({ trashcore, m, args, chat, sender, xreply }) => {
    if (args.length < 2)
      return xreply("❌ Usage: .remind <minutes> <message>\nExample: .remind 10 Take your medicine");
    const minutes = parseFloat(args[0]);
    if (isNaN(minutes) || minutes < 1 || minutes > 60)
      return xreply("❌ Time must be between 1 and 60 minutes.");
    const msg = args.slice(1).join(" ");
    await xreply(`⏰ Reminder set! I'll remind you in *${minutes} minute${minutes !== 1 ? "s" : ""}*.\n📝 Note: _${msg}_`);
    setTimeout(async () => {
      try {
        await trashcore.sendMessage(chat, {
          text: `⏰ *Reminder!*\n\n@${sender} — ${msg}`,
          mentions: [`${sender}@s.whatsapp.net`]
        }, { quoted: m });
      } catch {}
    }, minutes * 60 * 1000);
  }
};
