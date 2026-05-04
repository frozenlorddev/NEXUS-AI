const riddles = [
  { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo" },
  { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps" },
  { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A map" },
  { q: "What has hands but can't clap?", a: "A clock" },
  { q: "What has a head and a tail but no body?", a: "A coin" },
  { q: "What gets wetter the more it dries?", a: "A towel" },
  { q: "I'm light as a feather, but even the strongest person can't hold me for more than 5 minutes. What am I?", a: "Breath" },
  { q: "What has 13 hearts but no organs?", a: "A deck of cards" },
  { q: "What has an eye but cannot see?", a: "A needle" },
  { q: "What can travel around the world while staying in a corner?", a: "A stamp" },
  { q: "The more you have of it, the less you see. What is it?", a: "Darkness" },
  { q: "What goes up but never comes down?", a: "Age" },
  { q: "I have branches but no fruit, trunk, or leaves. What am I?", a: "A bank" },
  { q: "What has legs but doesn't walk?", a: "A table" },
  { q: "What is full of holes but still holds water?", a: "A sponge" },
];
const pending = new Map();

module.exports = {
  command: ["riddle", "answer"],
  desc: "Get a riddle and guess the answer",
  category: "Fun",
  usage: ".riddle — get riddle | .answer <your answer> — guess",
  run: async ({ command, args, chat, sender, xreply }) => {
    const key = `${chat}_${sender}`;
    if (command === "answer") {
      const r = pending.get(key);
      if (!r) return xreply("❌ No active riddle. Use .riddle to get one!");
      const guess = args.join(" ").toLowerCase().trim();
      if (r.a.toLowerCase().includes(guess) || guess.includes(r.a.toLowerCase())) {
        pending.delete(key);
        return xreply(`✅ *Correct!* 🎉\nThe answer was: *${r.a}*`);
      }
      return xreply(`❌ *Wrong!* Try again or use .riddle to skip.\n_Hint: ${r.a.split("").map((c,i) => i === 0 || c === " " ? c : "_").join("")}_`);
    }
    const r = riddles[Math.floor(Math.random() * riddles.length)];
    pending.set(key, r);
    setTimeout(() => pending.delete(key), 120000);
    return xreply(`🧩 *Riddle*\n\n${r.q}\n\n_Reply with_ *.answer <your guess>* _(2 min to answer)_`);
  }
};
