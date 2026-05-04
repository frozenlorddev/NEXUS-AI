module.exports = {
command: "inspect",
desc: "Check WhatsApp group or channel information using a link",
category: "Utility",
usage: ".inspect <group/channel link>",

run: async ({ m, trashcore, args, xreply }) => {

try {

const text = args.join(" ").trim()

if (!text) {
return xreply(
"🔎 *INSPECT COMMAND*\n\n" +
"Check information about a WhatsApp group or channel using a link.\n\n" +
"Example:\n" +
".inspect https://chat.whatsapp.com/xxxx\n" +
".inspect https://whatsapp.com/channel/xxxx"
)
}

const groupPattern = /chat\.whatsapp\.com\/([\w\d]*)/
const channelPattern = /whatsapp\.com\/channel\/([\w\d]*)/

// ================= GROUP =================
if (groupPattern.test(text)) {

const inviteCode = text.match(groupPattern)[1]

const groupInfo = await trashcore.groupGetInviteInfo(inviteCode)

let message = "📋 *GROUP INFORMATION*\n\n"

message += "Name: " + groupInfo.subject + "\n"
message += "ID: " + groupInfo.id + "\n"
message += "Created: " + new Date(groupInfo.creation * 1000).toLocaleString() + "\n"

if (groupInfo.owner) {
message += "Creator: @" + groupInfo.owner.split("@")[0] + "\n"
}

message += "Restricted: " + (groupInfo.restrict ? "Yes" : "No") + "\n"
message += "Announcement Only: " + (groupInfo.announce ? "Yes" : "No") + "\n"
message += "Community: " + (groupInfo.isCommunity ? "Yes" : "No") + "\n"
message += "Join Approval: " + (groupInfo.joinApprovalMode ? "Yes" : "No") + "\n"

if (groupInfo.participants) {
message += "Members: " + groupInfo.participants.length + "\n"
}

message += "\n"

if (groupInfo.desc) {
message += "*Description*\n"
message += groupInfo.desc + "\n\n"
}

if (groupInfo.participants) {

const admins = groupInfo.participants.filter(function(p){
return p.admin
})

if (admins.length > 0) {

message += "*Admins*\n"

admins.forEach(function(a){
message += "- @" + a.id.split("@")[0] + " (" + a.admin + ")\n"
})

}

}

let mentions = []

if (groupInfo.owner) {
mentions.push(groupInfo.owner)
}

if (groupInfo.participants) {

groupInfo.participants.forEach(function(p){
if (p.admin) mentions.push(p.id)
})

}

return trashcore.sendMessage(
m.chat,
{ text: message, mentions: mentions },
{ quoted: m }
)

}

// ================= CHANNEL =================
else if (channelPattern.test(text)) {

const channelId = text.match(channelPattern)[1]

const channelInfo = await trashcore.newsletterMsg(channelId)

let message = "📺 *CHANNEL INFORMATION*\n\n"

message += "ID: " + channelInfo.id + "\n"

if (channelInfo.state && channelInfo.state.type) {
message += "State: " + channelInfo.state.type + "\n"
}

if (channelInfo.thread_metadata) {

const meta = channelInfo.thread_metadata

if (meta.name && meta.name.text) {
message += "Name: " + meta.name.text + "\n"
}

if (meta.creation_time) {
message += "Created: " + new Date(meta.creation_time * 1000).toLocaleString() + "\n"
}

if (meta.subscribers_count) {
message += "Subscribers: " + meta.subscribers_count + "\n"
}

if (meta.verification) {
message += "Verification: " + meta.verification + "\n"
}

message += "\n"

if (meta.description && meta.description.text) {
message += "*Description*\n" + meta.description.text
} else {
message += "*Description*\nNo description"
}

}

return xreply(message)

}

// ================= INVALID =================
else {

return xreply("❌ Only WhatsApp group or channel links are supported.")

}

} catch (err) {

return xreply("❌ Error: " + err.message)

}

}
}
