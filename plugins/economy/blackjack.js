const { getWallet } = require("../../database");
const games = new Map();

function card() {
  const suits = ["♠","♥","♦","♣"];
  const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  return { suit: suits[Math.floor(Math.random()*4)], value: values[Math.floor(Math.random()*13)] };
}
function cardVal(c) {
  if (["J","Q","K"].includes(c.value)) return 10;
  if (c.value === "A") return 11;
  return parseInt(c.value);
}
function handTotal(hand) {
  let total = hand.reduce((s,c) => s + cardVal(c), 0);
  let aces = hand.filter(c => c.value === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}
function showHand(hand, hideSecond = false) {
  return hand.map((c, i) => (hideSecond && i === 1) ? "🂠" : `${c.value}${c.suit}`).join(" ");
}

module.exports = {
  command: ["blackjack", "bj"],
  desc: "Play Blackjack! Try to get as close to 21 as possible.",
  category: "Economy",
  usage: ".blackjack <amount> | .bj hit | .bj stand",
  run: async ({ sender, args, xreply }) => {
    const { db } = require("../../database");
    const key = sender;
    if (args[0] === "hit" || args[0] === "stand") {
      const g = games.get(key);
      if (!g) return xreply("❌ No active game. Start with .blackjack <amount>");
      if (args[0] === "hit") {
        g.player.push(card());
        const total = handTotal(g.player);
        if (total > 21) {
          games.delete(key);
          db.prepare("UPDATE economy SET coins=coins-?, total_lost=total_lost+? WHERE user_id=?").run(g.bet, g.bet, sender);
          return xreply(`🃏 Your hand: ${showHand(g.player)} = *${total}*\n\n💥 *BUST! You lose ${g.bet} coins.*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
        }
        return xreply(`🃏 Your hand: ${showHand(g.player)} = *${total}*\n🃏 Dealer: ${showHand(g.dealer, true)}\n\nType *.bj hit* or *.bj stand*`);
      } else {
        while (handTotal(g.dealer) < 17) g.dealer.push(card());
        const pt = handTotal(g.player), dt = handTotal(g.dealer);
        games.delete(key);
        if (dt > 21 || pt > dt) {
          const won = g.bet;
          db.prepare("UPDATE economy SET coins=coins+?, total_won=total_won+? WHERE user_id=?").run(won, won, sender);
          return xreply(`🃏 Your: ${showHand(g.player)} = *${pt}*\n🃏 Dealer: ${showHand(g.dealer)} = *${dt}*\n\n🏆 *You win! +${won} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
        } else if (pt === dt) {
          return xreply(`🃏 Your: ${showHand(g.player)} = *${pt}*\n🃏 Dealer: ${showHand(g.dealer)} = *${dt}*\n\n🤝 *Push! Bet returned.*`);
        } else {
          db.prepare("UPDATE economy SET coins=coins-?, total_lost=total_lost+? WHERE user_id=?").run(g.bet, g.bet, sender);
          return xreply(`🃏 Your: ${showHand(g.player)} = *${pt}*\n🃏 Dealer: ${showHand(g.dealer)} = *${dt}*\n\n😢 *Dealer wins! -${g.bet} coins*\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
        }
      }
    }
    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet < 10) return xreply("❌ Usage: .blackjack <amount> (min 10 coins)");
    const w = getWallet(sender);
    if (bet > w.coins) return xreply(`❌ Not enough coins! You have ${w.coins.toLocaleString()}`);
    const player = [card(), card()], dealer = [card(), card()];
    games.set(key, { player, dealer, bet });
    const pt = handTotal(player);
    if (pt === 21) {
      const won = Math.floor(bet * 1.5);
      games.delete(key);
      db.prepare("UPDATE economy SET coins=coins+?, total_won=total_won+? WHERE user_id=?").run(won, won, sender);
      return xreply(`🃏 Your: ${showHand(player)} = *21*\n\n🃏 *BLACKJACK!* You win *+${won} coins*!\n👛 Balance: ${getWallet(sender).coins.toLocaleString()}`);
    }
    return xreply(`🎴 *Blackjack Started!* Bet: ${bet} coins\n\n🃏 Your hand: ${showHand(player)} = *${pt}*\n🃏 Dealer: ${showHand(dealer, true)}\n\nType *.bj hit* or *.bj stand*`);
  }
};
