module.exports = {
  command: ["listadmins", "admins"],
  desc: "List all admins in the group",
  category: "Group",
  usage: ".listadmins",
  run: async ({ trashcore, chat, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ This command only works in groups.");
    try {
      const group = await trashcore.groupMetadata(chat);
      const admins = group.participants.filter(p => p.admin);
      if (!admins.length) return xreply("ℹ️ No admins found in this group.");
      const list = admins.map((p, i) => {
        const num = p.id.split("@")[0];
        const role = p.admin === "superadmin" ? "👑 Super Admin" : "⭐ Admin";
        return `${i + 1}. @${num} — ${role}`;
      }).join("\n");
      await trashcore.sendMessage(chat, {
        text: `👮 *Group Admins (${admins.length})*\n\n${list}`,
        mentions: admins.map(p => p.id)
      });
    } catch {
      return xreply("❌ Failed to fetch group admins.");
    }
  }
};
