const fs = require('fs');
const path = require('path');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const NodeCache = require('node-cache');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  initAuthCreds,
  BufferJSON
} = require('@trashcore/baileys');

const { loadPlugins, watchPlugins, plugins } = require('./pluginStore');
const { initDatabase, getSetting } = require('./database');
const { logMessage } = require('./database/logger');
const config = require('./config');

global.botStartTime = Date.now();

const log = {
  info:    (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error:   (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn:    (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s/86400)}d ${Math.floor((s%86400)/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s`;
}

function normalizeNumber(jid) {
  return jid ? jid.split('@')[0].split(':')[0] : '';
}

// POSTGRES
const DATABASE_URL = process.env.DATABASE_URL || config.DATABASE_URL || '';
if (!DATABASE_URL) { console.error('DATABASE_URL not set!'); process.exit(1); }

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function initPG() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wa_sessions (
      phone        TEXT PRIMARY KEY,
      creds        TEXT NOT NULL,
      keys         TEXT NOT NULL DEFAULT '{}',
      connected_at BIGINT
    )
  `);
  log.success('Postgres session table ready');
}

async function usePostgresAuthState(phone) {
  const row = await pool.query('SELECT creds, keys FROM wa_sessions WHERE phone = $1', [phone]);
  let creds = row.rows[0]?.creds ? JSON.parse(row.rows[0].creds, BufferJSON.reviver) : initAuthCreds();
  let keys  = row.rows[0]?.keys  ? JSON.parse(row.rows[0].keys,  BufferJSON.reviver) : {};

  const saveState = async () => {
    await pool.query(
      `INSERT INTO wa_sessions (phone,creds,keys,connected_at) VALUES ($1,$2,$3,$4)
       ON CONFLICT (phone) DO UPDATE SET creds=$2,keys=$3,connected_at=$4`,
      [phone, JSON.stringify(creds, BufferJSON.replacer), JSON.stringify(keys, BufferJSON.replacer), Date.now()]
    );
  };

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          const data = {};
          for (const id of ids) { const v = keys[`${type}-${id}`]; if (v) data[id] = v; }
          return data;
        },
        set: async (data) => {
          for (const cat of Object.keys(data))
            for (const id of Object.keys(data[cat])) {
              const v = data[cat][id];
              if (v) keys[`${cat}-${id}`] = v; else delete keys[`${cat}-${id}`];
            }
          await saveState();
        }
      }
    },
    saveCreds: saveState
  };
}

// SESSION REGISTRY
let activeSessions = {}; // currently connected
let dbSessions     = {}; // everything in Postgres (source of truth for panel list)
const activeConns   = {};
const startingLocks = {};
function getAllSessions() {
  // Merge dbSessions with live activeSessions data
  return Object.values(dbSessions).map(s => ({
    ...s,
    status: activeSessions[s.phoneNumber] ? 'connected' : 'reconnecting'
  }));
}
const pairingCodes = new NodeCache({ stdTTL: 3600 });

// START BOT
async function startBot(phoneNumber, onCode = null) {
  if (startingLocks[phoneNumber]) { log.warn(`Already starting ${phoneNumber}`); return null; }
  startingLocks[phoneNumber] = true;

  if (activeConns[phoneNumber]) {
    try { activeConns[phoneNumber].ws?.terminate(); } catch(e) {}
    try { activeConns[phoneNumber].end(true); } catch(e) {}
    delete activeConns[phoneNumber];
  }

  const { state, saveCreds } = await usePostgresAuthState(phoneNumber);
  const { version } = await fetchLatestBaileysVersion();

  const trashcore = makeWASocket({
    version,
    keepAliveIntervalMs: 10000,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }).child({ level: 'silent' }))
    },
    browser: ['Ubuntu', 'Opera', '100.0.4815.0'],
    syncFullHistory: true
  });

  activeConns[phoneNumber] = trashcore;

  const createToxxicStore = require('./basestore');
  const store = createToxxicStore('./store', { maxMessagesPerChat: 100, memoryOnly: false });
  store.bind(trashcore.ev);

  if (!state.creds.registered && onCode) {
    setTimeout(async () => {
      try {
        const code = await trashcore.requestPairingCode(phoneNumber);
        const fmt  = code?.match(/.{1,4}/g)?.join('-') || code;
        pairingCodes.set(fmt, { phoneNumber });
        onCode(null, fmt);
      } catch (err) {
        log.error('Pairing code error: ' + err.message);
        onCode(err, null);
      }
    }, 3000);
  } else if (state.creds.registered) {
    log.info(`Session reloaded: ${phoneNumber}`);
  }

  trashcore.ev.on('creds.update', saveCreds);

  let dbReady = false;

  trashcore.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      await saveCreds();
      const botNum = normalizeNumber(trashcore.user.id);
      log.success(`Connected: ${botNum}`);
      activeSessions[phoneNumber] = { phoneNumber, connectedAt: Date.now() };
      dbSessions[phoneNumber]     = { phoneNumber, connectedAt: Date.now() };
      delete startingLocks[phoneNumber];
      dbReady = true;

      await initDatabase();
      loadPlugins();
      watchPlugins();

      const prefix = getSetting(botNum, 'prefix') || config.PREFIX || '.';
      const msg = `💠 *${config.BOT_NAME || 'CyberByte Ai'} ACTIVATED*\n\n> ❐ Prefix: ${prefix}\n> ❐ Plugins: ${plugins.size}\n> ❐ Connected: wa.me/${botNum}\n✓ Uptime: _${formatUptime(Date.now() - global.botStartTime)}_`;
      await trashcore.sendMessage(`${botNum}@s.whatsapp.net`, { text: msg });

      try {
        const initAntiDelete = require('./database/antiDelete');
        initAntiDelete(trashcore, { botNumber: `${botNum}@s.whatsapp.net`, dbPath: './database/antidelete.json', enabled: true });
      } catch(e) {}

    } else if (connection === 'close') {
      delete startingLocks[phoneNumber];
      delete activeSessions[phoneNumber];
      delete activeConns[phoneNumber];
      dbReady = false;

      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        log.warn(`Logged out: ${phoneNumber}`);
        await pool.query('DELETE FROM wa_sessions WHERE phone = $1', [phoneNumber]);
        delete dbSessions[phoneNumber]; // truly gone
      } else if (code === 440) {
        log.warn(`Connection replaced: ${phoneNumber}, retry in 15s`);
        setTimeout(() => startBot(phoneNumber), 15000);
      } else {
        log.warn(`Reconnecting: ${phoneNumber} (${code})`);
        setTimeout(() => startBot(phoneNumber), 5000);
      }
    }
  });

  trashcore.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify' || !dbReady) return;
    const m = messages?.[0];
    if (!m?.message) return;

    if (m.key.remoteJid === 'status@broadcast') {
      const enabled = getSetting(normalizeNumber(trashcore.user.id), 'statusView', true);
      if (enabled) await trashcore.readMessages([m.key]);
      return;
    }
    if (m.message.ephemeralMessage) m.message = m.message.ephemeralMessage.message;

    // Anti-link protection
    const botNum = normalizeNumber(trashcore.user.id);
    const chatId = m.key.remoteJid;
    if (chatId?.endsWith('@g.us')) {
      const antiLinkOn = getSetting(botNum, `antilink_${chatId}`, false);
      if (antiLinkOn) {
        const text =
          m.message?.conversation ||
          m.message?.extendedTextMessage?.text ||
          m.message?.imageMessage?.caption || '';
        const linkRegex = /(https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/)[^\s]*/i;
        if (linkRegex.test(text)) {
          try {
            const group = await trashcore.groupMetadata(chatId);
            const senderJid = m.key.participant || chatId;
            const isAdmin = group.participants.some(p => p.id === senderJid && p.admin);
            if (!isAdmin) {
              await trashcore.sendMessage(chatId, { delete: m.key });
              await trashcore.sendMessage(chatId, {
                text: `🛡️ Anti-link: Link removed from @${normalizeNumber(senderJid)}`,
                mentions: [senderJid]
              });
              return;
            }
          } catch(e) {}
        }
      }
    }

    await logMessage(m, trashcore);
    delete require.cache[require.resolve('./command')];
    await require('./command')(trashcore, m);
  });

  // Welcome & Goodbye messages
  trashcore.ev.on('group-participants.update', async ({ id, participants, action }) => {
    if (!dbReady) return;
    const botNum = normalizeNumber(trashcore.user.id);
    if (action === 'add') {
      const welcomeOn = getSetting(botNum, `welcome_${id}`, false);
      if (!welcomeOn) return;
      const group = await trashcore.groupMetadata(id).catch(() => null);
      const groupName = group?.subject || 'this group';
      for (const jid of participants) {
        const num = normalizeNumber(jid);
        const customMsg = getSetting(botNum, `welcome_msg_${id}`, null);
        const text = customMsg
          ? customMsg.replace(/\{name\}/g, `@${num}`)
          : `👋 Welcome @${num} to *${groupName}*!\n\nGlad to have you here. Please read the group rules.`;
        await trashcore.sendMessage(id, { text, mentions: [jid] }).catch(() => {});
      }
    } else if (action === 'remove') {
      const byeOn = getSetting(botNum, `goodbye_${id}`, false);
      if (!byeOn) return;
      for (const jid of participants) {
        const num = normalizeNumber(jid);
        await trashcore.sendMessage(id, {
          text: `👋 @${num} has left the group. We'll miss you!`,
          mentions: [jid]
        }).catch(() => {});
      }
    }
  });

  return trashcore;
}

// EXPRESS
const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PANEL_PASSWORD = process.env.PANEL_PASSWORD || config.PANEL_PASSWORD || 'CyberByteAi';
const MAX_SESSIONS   = parseInt(process.env.MAX_SESSIONS || config.MAX_SESSIONS || '30');

function requireAuth(req, res, next) {
  if (!req.body.password || req.body.password !== PANEL_PASSWORD)
    return res.status(401).json({ error: 'Incorrect password.' });
  next();
}

app.post('/api/auth', (req, res) => {
  res.json(req.body.password === PANEL_PASSWORD ? { ok: true } : { error: 'Incorrect password.' });
});

app.post('/api/connect', async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\d{7,15}$/.test(phone))
    return res.status(400).json({ error: 'Invalid phone number.' });

  if (activeSessions[phone] || startingLocks[phone]) {
    const check = await pool.query('SELECT phone FROM wa_sessions WHERE phone = $1', [phone]);
    if (check.rows.length > 0)
      return res.status(409).json({ error: `${phone} already connected. Delete first.` });
    delete activeSessions[phone];
    delete startingLocks[phone];
  }

  if (getAllSessions().length >= MAX_SESSIONS)
    return res.status(403).json({ error: `Session limit reached (${MAX_SESSIONS} max). Delete a session first.` });

  try {
    await new Promise((resolve, reject) => {
      startBot(phone, (err, code) => {
        if (err) return reject(err);
        res.json({ code });
        resolve();
      });
    });
  } catch (err) {
    log.error('Pairing: ' + err.message);
    res.status(500).json({ error: 'Failed to generate code. Try again.' });
  }
});

app.post('/api/delsession', requireAuth, async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required.' });

  delete activeSessions[phone];
  delete startingLocks[phone];
  if (activeConns[phone]) {
    try { activeConns[phone].ws?.terminate(); } catch(e) {}
    try { activeConns[phone].end(true); } catch(e) {}
    delete activeConns[phone];
  }
  await pool.query('DELETE FROM wa_sessions WHERE phone = $1', [phone]);
  delete dbSessions[phone];
  log.info(`Deleted: ${phone}`);
  res.json({ ok: true });
});

app.get('/api/sessions', (req, res) => res.json({ sessions: getAllSessions() }));

app.get('/api/status', (req, res) => res.json({
  status: 'online',
  uptime: Math.floor((Date.now() - global.botStartTime) / 1000),
  sessions: getAllSessions().length,
  maxSessions: MAX_SESSIONS,
  sessionList: getAllSessions()
}));

// STARTUP
const PORT = process.env.PORT || 5000;

async function main() {
  await initPG();

  const rows = (await pool.query('SELECT phone, connected_at FROM wa_sessions')).rows;
  log.info(`Loading ${rows.length} session(s)…`);
  for (const r of rows) {
    dbSessions[r.phone]     = { phoneNumber: r.phone, connectedAt: Number(r.connected_at) };
    activeSessions[r.phone] = { phoneNumber: r.phone, connectedAt: Number(r.connected_at) };
    await startBot(r.phone);
  }

  app.listen(PORT, '0.0.0.0', () => log.success(`Panel → http://localhost:${PORT}`));
}

main().catch(err => { log.error(err.message); process.exit(1); });
