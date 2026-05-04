const axios = require("axios")
const cheerio = require("cheerio")

async function getAILeaderboard() {

const { data: html } = await axios.get("https://lmarena.ai/leaderboard", {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36"
}
})

const $ = cheerio.load(html)

let leaderboards = {}

$("div.my-7 > div.w-full").each((i, el) => {

const categoryTitle = $(el).find("h2.font-heading").text().trim()
if (!categoryTitle) return

let models = []

$(el).find("table tbody tr").each((i, row) => {

const rank = $(row).find("td:nth-child(1)").text().trim()
const modelName = $(row).find("td:nth-child(2)").text().trim()
const score = $(row).find("td:nth-child(3)").text().trim()
const votes = $(row).find("td:nth-child(4)").text().trim()

if (rank && modelName) {

models.push({
rank: parseInt(rank),
model: modelName,
score: parseInt(score.replace(/,/g, "")) || 0,
votes: parseInt(votes.replace(/,/g, "")) || 0
})

}

})

if (models.length > 0) {
leaderboards[categoryTitle] = models
}

})

return leaderboards
}

module.exports = {
command: "ai-rank",
desc: "View best AI models leaderboard from LMArena",
category: "AI",
usage: ".ai-leaderboard [category]",

run: async ({ m, trashcore, args, xreply }) => {

try {

const category = args.join(" ").toLowerCase()

const leaderboards = await getAILeaderboard()

const categories = Object.keys(leaderboards)

if (categories.length === 0) {
return xreply("❌ Failed to fetch leaderboard data.")
}


// ===== SHOW ALL CATEGORIES =====
if (!category) {

let text = "🤖 *AI LEADERBOARD*\n\n"
text += "Source: LMArena.ai\n\n"

for (let cat of categories) {

const topModels = leaderboards[cat].slice(0, 3)

text += "📊 *" + cat.toUpperCase() + "*\n"

for (let m of topModels) {

let medal = "#"+m.rank
if (m.rank === 1) medal = "🥇"
if (m.rank === 2) medal = "🥈"
if (m.rank === 3) medal = "🥉"

text += medal + " " + m.model + "\n"
text += "Score: " + m.score.toLocaleString() + " | Votes: " + m.votes.toLocaleString() + "\n\n"

}

text += "\n"

}

text += "To view a specific category:\n"
text += ".ai-leaderboard text"

return trashcore.sendMessage(
m.chat,
{ text: text },
{ quoted: m }
)

}


// ===== SPECIFIC CATEGORY =====
else {

const matched = categories.find(c =>
c.toLowerCase().includes(category)
)

if (!matched) {

return xreply(
"❌ Category not found.\n\nAvailable:\n" +
categories.join(", ")
)

}

const models = leaderboards[matched].slice(0, 10)

let text = "🤖 *AI LEADERBOARD - " + matched.toUpperCase() + "*\n\n"

for (let m of models) {

let medal = "#"+m.rank
if (m.rank === 1) medal = "🥇"
if (m.rank === 2) medal = "🥈"
if (m.rank === 3) medal = "🥉"

text += medal + " " + m.model + "\n"
text += "Score: " + m.score.toLocaleString() + "\n"
text += "Votes: " + m.votes.toLocaleString() + "\n\n"

}

return trashcore.sendMessage(
m.chat,
{ text: text },
{ quoted: m }
)

}

} catch (err) {

return xreply("❌ Error: " + err.message)

}

}
}
