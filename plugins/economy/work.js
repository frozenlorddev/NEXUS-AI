const { getWallet } = require("../../database");

const jobs = [
  { name: "Programmer", min: 100, max: 400 },
  { name: "Driver", min: 80, max: 250 },
  { name: "Doctor", min: 200, max: 600 },
  { name: "Chef", min: 100, max: 350 },
  { name: "Teacher", min: 80, max: 280 },
  { name: "Hacker", min: 150, max: 500 },
  { name: "YouTuber", min: 50, max: 800 },
  { name: "Streamer", min: 40, max: 700 },
  { name: "Trader", min: 100, max: 900 },
  { name: "Mechanic", min: 90, max: 300 },
];

module.exports = {
  command: ["work", "job", "earn"],
  desc: "Work to earn coins (1 hour cooldown)",
  category: "Economy",
  usage: ".work",
  run: async ({ sender, xreply }) => {
    const w = getWallet(sender);
    const now = Date.now();
    const cooldown = 60 * 60 * 1000;
    if (w.work_last && now - w.work_last < cooldown) {
      const remaining = cooldown - (now - w.work_last);
      const m = Math.floor(remaining / 60000);
      return xreply(`⏳ You're tired. Rest for *${m} more minute${m !== 1 ? "s" : ""}* before working again.`);
    }
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const earned = Math.floor(Math.random() * (job.max - job.min)) + job.min;
    const { db } = require("../../database");
    db.prepare("UPDATE economy SET coins=coins+?, work_last=? WHERE user_id=?").run(earned, now, sender);
    const acts = [
      `completed a project`, `fixed a critical bug`, `served 20 customers`,
      `delivered packages`, `taught a class`, `performed surgery`, `cooked 50 meals`
    ];
    const act = acts[Math.floor(Math.random() * acts.length)];
    return xreply(
      `💼 *Work Complete!*\n\n` +
      `🧑‍💼 Job: ${job.name}\n` +
      `📋 Task: You ${act} and got paid!\n` +
      `💰 Earned: *+${earned} coins*\n\n` +
      `👛 Balance: ${getWallet(sender).coins.toLocaleString()} coins`
    );
  }
};
