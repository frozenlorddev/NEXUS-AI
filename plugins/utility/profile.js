module.exports = {
  command: ["profile", "pp", "pfp"],
  desc: "Get profile picture of a user",
  category: "Utility",
  usage: ".profile @user or .profile (reply)",
  run: async ({ trashcore, m, args, chat, sender, xreply }) => {
    let target =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0] ? `${args[0].replace(/\D/g, "")}@s.whatsapp.net` : null) ||
      `${sender}@s.whatsapp.net`;
    try {
      const pp = await trashcore.profilePictureUrl(target, "image");
      const num = target.split("@")[0];
      await trashcore.sendMessage(chat, {
        image: { url: pp },
        caption: `🖼️ Profile picture of @${num}`,
        mentions: [target]
      }, { quoted: m });
    } catch {
      await xreply("❌ Could not fetch profile picture. User may have privacy settings enabled.");
    }
  }
};
