const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

let db;

function initDatabase() {
  const dbFolder = path.join(__dirname, "database");
  if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder);

  const dbPath = path.join(dbFolder, "trashbot.db");
  db = new Database(dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      phone TEXT NOT NULL,
      key   TEXT NOT NULL,
      value TEXT,
      PRIMARY KEY (phone, key)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id       TEXT PRIMARY KEY,
      phone    TEXT,
      chatId   TEXT,
      senderId TEXT,
      body     TEXT,
      timestamp INTEGER
    )
  `).run();

  // Economy system
  db.prepare(`
    CREATE TABLE IF NOT EXISTS economy (
      user_id   TEXT PRIMARY KEY,
      coins     INTEGER DEFAULT 500,
      bank      INTEGER DEFAULT 0,
      daily_claimed INTEGER DEFAULT 0,
      weekly_claimed INTEGER DEFAULT 0,
      work_last INTEGER DEFAULT 0,
      total_won INTEGER DEFAULT 0,
      total_lost INTEGER DEFAULT 0,
      streak    INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    )
  `).run();
  // Migrations: add columns if they don't exist yet
  const economyCols = db.prepare("PRAGMA table_info(economy)").all().map(c => c.name);
  if (!economyCols.includes("streak"))         db.prepare("ALTER TABLE economy ADD COLUMN streak INTEGER DEFAULT 0").run();
  if (!economyCols.includes("bank"))           db.prepare("ALTER TABLE economy ADD COLUMN bank INTEGER DEFAULT 0").run();
  if (!economyCols.includes("total_won"))      db.prepare("ALTER TABLE economy ADD COLUMN total_won INTEGER DEFAULT 0").run();
  if (!economyCols.includes("total_lost"))     db.prepare("ALTER TABLE economy ADD COLUMN total_lost INTEGER DEFAULT 0").run();
  if (!economyCols.includes("daily_claimed"))  db.prepare("ALTER TABLE economy ADD COLUMN daily_claimed INTEGER DEFAULT 0").run();
  if (!economyCols.includes("weekly_claimed")) db.prepare("ALTER TABLE economy ADD COLUMN weekly_claimed INTEGER DEFAULT 0").run();
  if (!economyCols.includes("work_last"))      db.prepare("ALTER TABLE economy ADD COLUMN work_last INTEGER DEFAULT 0").run();

  // Warnings system
  db.prepare(`
    CREATE TABLE IF NOT EXISTS warnings (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reason  TEXT,
      warned_at INTEGER DEFAULT (strftime('%s','now'))
    )
  `).run();

  // Marriage system
  db.prepare(`
    CREATE TABLE IF NOT EXISTS marriages (
      user1 TEXT NOT NULL,
      user2 TEXT NOT NULL,
      married_at INTEGER DEFAULT (strftime('%s','now')),
      PRIMARY KEY (user1, user2)
    )
  `).run();

  // Reputation system
  db.prepare(`
    CREATE TABLE IF NOT EXISTS reputation (
      user_id   TEXT PRIMARY KEY,
      rep_points INTEGER DEFAULT 0,
      last_given TEXT DEFAULT '{}'
    )
  `).run();

  // Bet history
  db.prepare(`
    CREATE TABLE IF NOT EXISTS bet_history (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id  TEXT NOT NULL,
      amount   INTEGER,
      result   TEXT,
      winnings INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    )
  `).run();

  module.exports.db = db;
  return db;
}

function getDb() { return db; }

function setSetting(phone, key, value) {
  db.prepare(`
    INSERT INTO settings (phone, key, value) VALUES (?, ?, ?)
    ON CONFLICT(phone, key) DO UPDATE SET value=excluded.value
  `).run(phone, key, JSON.stringify(value));
}

function getSetting(phone, key, defaultValue = null) {
  const row = db.prepare("SELECT value FROM settings WHERE phone=? AND key=?").get(phone, key);
  return row ? JSON.parse(row.value) : defaultValue;
}

// Economy helpers
function getWallet(userId) {
  let row = db.prepare("SELECT * FROM economy WHERE user_id=?").get(userId);
  if (!row) {
    db.prepare("INSERT OR IGNORE INTO economy (user_id) VALUES (?)").run(userId);
    row = db.prepare("SELECT * FROM economy WHERE user_id=?").get(userId);
  }
  return row;
}

function addCoins(userId, amount) {
  db.prepare("INSERT OR IGNORE INTO economy (user_id) VALUES (?)").run(userId);
  db.prepare("UPDATE economy SET coins = MAX(0, coins + ?) WHERE user_id=?").run(amount, userId);
  return db.prepare("SELECT coins FROM economy WHERE user_id=?").get(userId)?.coins || 0;
}

function setCoins(userId, amount) {
  db.prepare("INSERT OR IGNORE INTO economy (user_id) VALUES (?)").run(userId);
  db.prepare("UPDATE economy SET coins=? WHERE user_id=?").run(amount, userId);
}

function getTopEconomy(limit = 10) {
  return db.prepare("SELECT user_id, coins, bank FROM economy ORDER BY (coins+bank) DESC LIMIT ?").all(limit);
}

// Warning helpers
function addWarning(chatId, userId, reason) {
  db.prepare("INSERT INTO warnings (chat_id, user_id, reason) VALUES (?,?,?)").run(chatId, userId, reason);
}
function getWarnings(chatId, userId) {
  return db.prepare("SELECT * FROM warnings WHERE chat_id=? AND user_id=?").all(chatId, userId);
}
function clearWarnings(chatId, userId) {
  return db.prepare("DELETE FROM warnings WHERE chat_id=? AND user_id=?").run(chatId, userId).changes;
}

// Marriage helpers
function getMarriage(userId) {
  return db.prepare("SELECT * FROM marriages WHERE user1=? OR user2=?").get(userId, userId);
}
function addMarriage(u1, u2) {
  const [a, b] = [u1, u2].sort();
  db.prepare("INSERT OR IGNORE INTO marriages (user1,user2) VALUES (?,?)").run(a, b);
}
function removeMarriage(userId) {
  db.prepare("DELETE FROM marriages WHERE user1=? OR user2=?").run(userId, userId);
}

// Reputation helpers
function getRep(userId) {
  let row = db.prepare("SELECT * FROM reputation WHERE user_id=?").get(userId);
  if (!row) {
    db.prepare("INSERT OR IGNORE INTO reputation (user_id) VALUES (?)").run(userId);
    row = db.prepare("SELECT * FROM reputation WHERE user_id=?").get(userId);
  }
  return row;
}
function addRep(userId, fromId) {
  db.prepare("INSERT OR IGNORE INTO reputation (user_id) VALUES (?)").run(userId);
  db.prepare("INSERT OR IGNORE INTO reputation (user_id) VALUES (?)").run(fromId);
  const fromRow = db.prepare("SELECT last_given FROM reputation WHERE user_id=?").get(fromId);
  const lastGiven = JSON.parse(fromRow?.last_given || "{}");
  const now = Date.now();
  const cooldown = 12 * 60 * 60 * 1000;
  if (lastGiven[userId] && now - lastGiven[userId] < cooldown) {
    return { success: false, remaining: cooldown - (now - lastGiven[userId]) };
  }
  lastGiven[userId] = now;
  db.prepare("UPDATE reputation SET rep_points=rep_points+1 WHERE user_id=?").run(userId);
  db.prepare("UPDATE reputation SET last_given=? WHERE user_id=?").run(JSON.stringify(lastGiven), fromId);
  return { success: true };
}
function getTopRep(limit = 10) {
  return db.prepare("SELECT * FROM reputation ORDER BY rep_points DESC LIMIT ?").all(limit);
}

function cleanupOldMessages(hours = 24) {
  if (!db) return 0;
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return db.prepare("DELETE FROM messages WHERE timestamp < ?").run(cutoff).changes || 0;
}

module.exports = {
  initDatabase, getDb, setSetting, getSetting, cleanupOldMessages, db: undefined,
  getWallet, addCoins, setCoins, getTopEconomy,
  addWarning, getWarnings, clearWarnings,
  getMarriage, addMarriage, removeMarriage,
  getRep, addRep, getTopRep
};
