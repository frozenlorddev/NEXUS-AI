const statements = [
  "Never have I ever lied to get out of trouble.",
  "Never have I ever stayed up all night gaming.",
  "Never have I ever pretended to be sick to skip school/work.",
  "Never have I ever eaten an entire pizza by myself.",
  "Never have I ever cried during a movie.",
  "Never have I ever googled myself.",
  "Never have I ever sent a message to the wrong person.",
  "Never have I ever fallen asleep during a phone call.",
  "Never have I ever forgotten someone's birthday.",
  "Never have I ever talked to myself out loud in public.",
  "Never have I ever snooped on someone's phone.",
  "Never have I ever broken a bone.",
  "Never have I ever pulled an all-nighter.",
  "Never have I ever eaten food off the floor.",
  "Never have I ever been on TV.",
  "Never have I ever gone a full day without my phone.",
  "Never have I ever laughed so hard I cried.",
  "Never have I ever ridden a motorcycle.",
  "Never have I ever visited another country.",
  "Never have I ever ghosted someone.",
];

module.exports = {
  command: ["nhi", "neverhave", "neverhavei"],
  desc: "Play Never Have I Ever",
  category: "Fun",
  usage: ".nhi",
  run: async ({ xreply }) => {
    const s = statements[Math.floor(Math.random() * statements.length)];
    return xreply(`🙅 *Never Have I Ever*\n\n"${s}"\n\n_React with 🙋 if you HAVE, 🙅 if you HAVEN'T!_`);
  }
};
