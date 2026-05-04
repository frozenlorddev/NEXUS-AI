const questions = [
  ["Be able to fly", "Be able to become invisible"],
  ["Always speak your mind", "Never be able to speak again"],
  ["Have unlimited money", "Have unlimited time"],
  ["Live without music", "Live without television"],
  ["Know how you will die", "Know when you will die"],
  ["Be the smartest person in the room", "Be the funniest person in the room"],
  ["Have a rewind button for your life", "Have a pause button for your life"],
  ["Never age physically", "Never age mentally"],
  ["Be able to read minds", "Be able to see the future"],
  ["Have 10 fingers on one hand", "Have no fingers at all"],
  ["Live in extreme cold", "Live in extreme heat"],
  ["Be famous but unhappy", "Be unknown but happy"],
  ["Have super strength", "Have super speed"],
  ["Give up social media", "Give up watching videos forever"],
  ["Fight 100 duck-sized horses", "Fight 1 horse-sized duck"],
];

module.exports = {
  command: ["wyr", "wouldyou", "wouldyourather"],
  desc: "Would you rather — fun dilemma questions",
  category: "Fun",
  usage: ".wyr",
  run: async ({ xreply }) => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    return xreply(`🤔 *Would You Rather?*\n\n🅰️ *${q[0]}*\n\n  OR\n\n🅱️ *${q[1]}*\n\n_Vote A or B!_`);
  }
};
