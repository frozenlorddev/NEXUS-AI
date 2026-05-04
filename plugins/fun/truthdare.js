module.exports = {
  command: ["truth", "dare", "tod"],
  desc: "Get a truth or dare question",
  category: "Fun",
  usage: ".truth | .dare",
  run: async ({ command, xreply }) => {
    const truths = [
      "What is the most embarrassing thing you've ever done?",
      "Have you ever lied to your best friend?",
      "What's your biggest fear?",
      "What's the worst gift you've ever received?",
      "Have you ever cheated in a game?",
      "What's your most embarrassing childhood memory?",
      "Have you ever pretended to be sick to avoid something?",
      "What's the most trouble you've ever been in?",
      "Do you have a secret talent?",
      "What is something you've never told your parents?",
    ];
    const dares = [
      "Send a voice note singing a nursery rhyme.",
      "Change your WhatsApp status to something embarrassing for 1 hour.",
      "Send a selfie with a silly face.",
      "Write a love poem for someone in this chat.",
      "Send a message to someone saying 'I love your cooking.'",
      "Do 20 push-ups and report back.",
      "Tell everyone your most-used app today.",
      "Send the last photo in your camera roll.",
      "Describe yourself in 3 emojis.",
      "Call someone by the wrong name for the next 10 minutes.",
    ];
    if (command === "truth" || command === "tod") {
      return xreply(`🔮 *Truth*\n\n${truths[Math.floor(Math.random() * truths.length)]}`);
    } else {
      return xreply(`🔥 *Dare*\n\n${dares[Math.floor(Math.random() * dares.length)]}`);
    }
  }
};
