const { plugins } = require('./pluginStore');
const { getSetting } = require('./database');

function normalizeNumber(jid) {
  return jid ? jid.split("@")[0].split(":")[0] : "";
}

async function handleMessage(trashcore, m) {
  if (!m || !m.message) return;

  const chatId    = m.key.remoteJid;
  const isGroup   = chatId.endsWith("@g.us");
  const isFromMe  = m.key.fromMe === true;

  if (isFromMe && isGroup) return;

  const senderJid    = m.key.participant || chatId;
  const senderNumber = normalizeNumber(senderJid);
  const botNumber    = normalizeNumber(trashcore.user.id);
  const isSelf       = senderNumber === botNumber;
  const isOwner      = senderNumber === botNumber;

  const text =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    m.message?.documentMessage?.caption ||
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.message?.templateButtonReplyMessage?.selectedId ||
    "";

  if (!text) return;

  // Settings are now scoped to this bot's phone number
  const prefix      = getSetting(botNumber, "prefix", "");
  const privateMode = getSetting(botNumber, "privateMode", false);

  if (!text.startsWith(prefix)) return;

  const args    = text.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  const plugin = plugins.get(command);
  if (!plugin) return;

  if (privateMode && !isOwner) return;

const cina = ["https://i.ibb.co/bMyHpNzT/d8d9e8676820a15b.jpg","https://i.ibb.co/bMyHpNzT/d8d9e8676820a15b.jpg","https://i.ibb.co/bMyHpNzT/d8d9e8676820a15b.jpg","https://i.ibb.co/bMyHpNzT/d8d9e8676820a15b.jpg"]

const loli = {
  key: {
    fromMe: false,
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    orderMessage: {
      orderId: "2009",
      thumbnail: cina,
      itemCount: "9741",
      status: "INQUIRY",
      surface: "CATALOG",
      message: `CyberByteAi.mzazi.shop`,
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
    }
  },
  contextInfo: {
    mentionedJid: ["120363369514105242@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: false,
  }
}

const reply = async(subject) => { 
trashcore.sendMessage(chatId, { text : subject,
contextInfo: {
mentionedJid: '254722000000',
forwardingScore: 9999, 
isForwarded: false, 
forwardedNewsletterMessageInfo: {
newsletterJid: '120363406028122214@newsletter',
serverMessageId: 20,
newsletterName: '୧⍤⃝୧CyberByteAi୧⍤⃝୧'
},
externalAdReply: {
title: "୧⍤⃝୧CyberByteAi୧⍤⃝୧", 
body: "",
thumbnailUrl: "https://files.catbox.moe/8ekyzy.jpg", 
sourceUrl: null,
mediaType: 1
}}}, { quoted : loli })
}
function stylishReply(text) {
    return `${text}`;
}

  

  const treply = async () => {
    try {
      await trashcore.sendMessage(chatId, {
        audio: { url: "https://files.catbox.moe/8z0cey.mp3" },
        mimetype: "audio/mp4",
        ptt: false
      }, { quoted: m });
    } catch (err) {
      console.error("Audio Reply Error:", err);
      await trashcore.sendMessage(chatId, { text: "⚠️ Failed to send audio reply." }, { quoted: m });
    }
  };

  try {
    await plugin.run({
      trashcore,
      m,
      args,
      text: args.join(" "),
      command,
      sender: senderNumber,
      chat: chatId,
      isGroup,
      isSelf,
      isOwner,
      botNumber,   // ← passed to plugins so they can call setSetting(botNumber, ...)
      treply,
      xreply,
    });
  } catch (err) {
    console.error("❌ Plugin error:", err);
  }
}

module.exports = handleMessage;
