const { addWarning, getWarnings, clearWarnings } = require("../../database");

module.exports = {
  command: ["warn", "unwarn", "warnings", "warnlist"],
  desc: "Warn users, clear warnings, or view warnings",
  category: "Group",
  usage: ".warn @user <reason> | .unwarn @user | .warnings @user",
  run: async ({ command, m, args, sender, chat, isOwner, trashcore, xreply }) => {
    if (!chat.endsWith("@g.us")) return xreply("⚠️ Only works in groups.");
    if (!isOwner && command !== "warnings" && command !== "warnlist") return xreply("❌ Only the bot owner can warn users.");
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.participant;
    if (command === "warn") {
      if (!target) return xreply("❌ Usage: .warn @user <reason>");
      const targetNum = target.split("@")[0];
      const reason = args.slice(1).join(" ") || "No reason given";
      addWarning(chat, targetNum, reason);
      const warns = getWarnings(chat, targetNum);
      const count = warns.length;
      let extra = "";
      if (count >= 3) {
        try { await trashcore.groupParticipantsUpdate(chat, [target], "remove"); extra = "\n🚨 Auto-kicked after 3 warnings!"; } catch {}
      }
      return xreply(`⚠️ *Warning ${count}/3* issued to @${targetNum}\n📝 Reason: ${reason}${extra}`, { mentions: [target] });
    }
    if (command === "unwarn") {
      if (!target) return xreply("❌ Usage: .unwarn @user");
      const targetNum = target.split("@")[0];
      const cleared = clearWarnings(chat, targetNum);
      return xreply(`✅ Cleared *${cleared}* warning(s) from @${targetNum}`, { mentions: [target] });
    }
    const checkTarget = target?.split("@")[0] || sender;
    const warns = getWarnings(chat, checkTarget);
    if (!warns.length) return xreply(`✅ @${checkTarget} has no warnings.`);
    const list = warns.map((w, i) => `${i+1}. ${w.reason}`).join("\n");
    return xreply(`⚠️ *Warnings for @${checkTarget}* (${warns.length}/3)\n\n${list}`);
  }
};
