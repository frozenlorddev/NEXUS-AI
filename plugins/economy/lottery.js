const { getWallet } = require("../../database");

const tickets = new Map();
const TICKET_PRICE = 50;
const JACKPOT_COINS = 10000;

module.exports = {
  command: ["lottery", "lotto", "buylotto"],
  desc: "Buy a lottery ticket and try to win the jackpot!",
  category: "Economy",
  usage: ".lottery buy | .lottery check | .lottery jackpot",
  run: async ({ command, args, sender, xreply }) => {
    const { db } = require("../../database");
    const sub = args[0] || "buy";
    if (sub === "jackpot" || sub === "prize") {
      const count = tickets.size;
      const pool = count * TICKET_PRICE;
      return xreply(`🎰 *Lottery Jackpot*\n\n🏆 Prize Pool: *${(JACKPOT_COINS + pool).toLocaleString()} coins*\n🎟️ Tickets Sold: ${count}\n💰 Ticket Price: ${TICKET_PRICE} coins\n\nUse .lottery buy to enter!`);
    }
    if (sub === "check") {
      const ticket = tickets.get(sender);
      if (!ticket) return xreply("❌ You don't have a lottery ticket.\nBuy one with .lottery buy");
      return xreply(`🎟️ *Your Ticket*\n\nNumbers: *${ticket.nums.join(", ")}*\n💡 Wait for the next draw!`);
    }
    if (sub === "buy") {
      if (tickets.has(sender)) {
        const t = tickets.get(sender);
        return xreply(`🎟️ You already have a ticket!\nNumbers: *${t.nums.join(", ")}*`);
      }
      const w = getWallet(sender);
      if (w.coins < TICKET_PRICE) return xreply(`❌ Not enough coins! You need *${TICKET_PRICE}* coins for a ticket.`);
      db.prepare("UPDATE economy SET coins=coins-? WHERE user_id=?").run(TICKET_PRICE, sender);
      const nums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1).sort((a, b) => a - b);
      tickets.set(sender, { nums, buyer: sender });
      const winning = Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1).sort((a, b) => a - b);
      const matches = nums.filter(n => winning.includes(n)).length;
      let prize = 0;
      if (matches === 6) prize = JACKPOT_COINS;
      else if (matches === 5) prize = 2000;
      else if (matches === 4) prize = 500;
      else if (matches === 3) prize = 100;
      if (prize > 0) {
        db.prepare("UPDATE economy SET coins=coins+? WHERE user_id=?").run(prize, sender);
        tickets.delete(sender);
        return xreply(
          `🎟️ *Your numbers:* ${nums.join(", ")}\n` +
          `🎯 *Winning:* ${winning.join(", ")}\n\n` +
          `✅ *${matches} matches! You won ${prize.toLocaleString()} coins!* 🎉`
        );
      }
      tickets.delete(sender);
      return xreply(
        `🎟️ *Your numbers:* ${nums.join(", ")}\n` +
        `🎯 *Winning:* ${winning.join(", ")}\n\n` +
        `😢 *${matches} match${matches !== 1 ? "es" : ""}. Better luck next time!*\n` +
        `_Try again with .lottery buy_`
      );
    }
    return xreply("❌ Usage: .lottery buy | .lottery jackpot");
  }
};
