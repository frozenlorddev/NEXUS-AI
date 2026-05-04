module.exports = {
command: "groupinfo",
desc: "Show full information about the group",
category: "Group",
usage: ".groupinfo",

run: async ({ m, trashcore, db, xreply }) => {

try {

if (!m.isGroup) {
return xreply("❌ This command only works in groups.")
}

// ===== helper functions =====
function getParticipantJid(participant){
if (!participant) return null
return participant.id || participant.jid || null
}

function resolveAnyLidToJid(owner, participants){
if (!owner) return null
if (!owner.includes("@lid")) return owner

const found = participants.find(p =>
(p.id && p.id.includes(owner.split("@")[0])) ||
(p.jid && p.jid.includes(owner.split("@")[0]))
)

return found ? (found.id || found.jid) : owner
}

function formatDate(timestamp){
const d = new Date(timestamp)
return d.toLocaleDateString("en-GB", {
day: "numeric",
month: "long",
year: "numeric"
})
}

// ===== group metadata =====
const groupMeta = m.groupMetadata
const participants = groupMeta.participants || []

const admins = participants.filter(p => p.admin)

let ownerJid = null

if (groupMeta.owner) {
ownerJid = resolveAnyLidToJid(groupMeta.owner, participants)
}

if (!ownerJid || ownerJid.includes("@lid")) {

const superAdmin = participants.find(p => p.admin === "superadmin")

if (superAdmin) {
ownerJid = getParticipantJid(superAdmin)
}

}

if (!ownerJid || ownerJid.includes("@lid")) {

const firstAdmin = admins[0]

if (firstAdmin) {
ownerJid = getParticipantJid(firstAdmin)
}

}

// ===== database group settings =====
const group = db && db.getGroup ? db.getGroup(m.chat) : {}

const createdDate = groupMeta.creation
? formatDate(groupMeta.creation * 1000)
: "Unknown"

let features = []

features.push(group.welcome === true || group.welcome === "on" ? "✅ Welcome" : "❌ Welcome")
features.push(group.goodbye === true || group.goodbye === "on" ? "✅ Goodbye" : "❌ Goodbye")
features.push(group.antilink === "on" ? "✅ AntiLink" : "❌ AntiLink")
features.push(group.antitagsw === "on" ? "✅ AntiTagSW" : "❌ AntiTagSW")
features.push(group.antiremove === "on" ? "✅ AntiRemove" : "❌ AntiRemove")

// ===== owner display =====
const ownerNumber = ownerJid ? ownerJid.split("@")[0] : null

const ownerDisplay =
ownerNumber && !ownerNumber.includes(":")
? "@" + ownerNumber
: "Unknown"

// ===== message text =====
let text = ""

text += "📊 *GROUP INFO*\n\n"

text += "Name: " + groupMeta.subject + "\n"
text += "ID: " + m.chat + "\n"
text += "Owner: " + ownerDisplay + "\n"
text += "Created: " + createdDate + "\n\n"

text += "━━━ MEMBERS ━━━\n"
text += "Total: " + participants.length + "\n"
text += "Admins: " + admins.length + "\n"
text += "Members: " + (participants.length - admins.length) + "\n\n"

text += "━━━ FEATURES ━━━\n"

features.forEach(f => {
text += f + "\n"
})

if (groupMeta.desc) {
text += "\n━━━ DESCRIPTION ━━━\n"
text += groupMeta.desc
}

// ===== send message =====
return trashcore.sendMessage(
m.chat,
{
text: text,
mentions: ownerJid && !ownerJid.includes(":") ? [ownerJid] : []
},
{ quoted: m }
)

} catch (err) {

return xreply("❌ Error: " + err.message)

}

}
}
