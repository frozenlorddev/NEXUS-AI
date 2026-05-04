module.exports = {
  command: ["cheat", "commands", "cmds"],
  desc: "Show a quick command cheatsheet",
  category: "Utility",
  usage: ".cheat",
  run: async ({ xreply }) => {
    return xreply(
      `📋 *Quick Command Cheatsheet*\n\n` +
      `🤖 *AI*\n.gpt .gemini .imagine .copilot .lyrics .roast .compliment .ai-rank\n\n` +
      `🎮 *Fun*\n.joke .quote .fact .8ball .coinflip .dice .rps .ship .truth .dare .wyr .numguess .trivia\n\n` +
      `🔧 *Utility*\n.ping .uptime .calc .time .weather .translate .wiki .define .shorten .qr .currency .remind .poll .profile .b64encode .b64decode .emojimix\n\n` +
      `📱 *Media*\n.sticker .toimage .tts .ytmp3 .ytmp4 .ig .spotify .play .tiktok .facebook .ocr\n\n` +
      `👥 *Group*\n.tagall .everyone .kick .add .promote .demote .mute .unmute .lock .unlock .antilink .welcome .goodbye .setgname .setgdesc .listadmins .groupinfo .leave .hidetag .swgc .getsw .linkgc\n\n` +
      `⚙️ *Admin*\n.menu .botinfo .mode .setprefix .setbio .status .owner .broadcast .block .unblock .setname .clearcache .statusview\n\n` +
      `_Type .menu for full details_`
    );
  }
};
