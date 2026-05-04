# CyberByte AI Bot

A WhatsApp multi-session bot with a full-featured web panel and 89 plugins across 8 categories.

## Architecture

- **Runtime**: Node.js 20 (CommonJS)
- **Main entry**: `index.js` — Express web server + WhatsApp bot engine
- **Frontend**: Static HTML/CSS/JS served from `public/index.html`
- **Database**: PostgreSQL (Replit built-in) via `pg` package — stores WhatsApp sessions
- **Local DB**: SQLite (`better-sqlite3`) via `database/trashbot.db` — stores settings per bot number
- **WhatsApp**: `@trashcore/baileys` library for WhatsApp Web protocol

## Key Files

- `index.js` — Main server, Express API routes, WhatsApp session management, anti-link, welcome/goodbye events
- `server.js` — Alternate/legacy server (not used as main entry)
- `config.js` — Bot configuration (name, prefix, owner, password, max sessions)
- `command.js` — Command dispatcher for WhatsApp messages
- `pluginStore.js` — Plugin loader and hot-reloader
- `database.js` — SQLite database init for local settings
- `database/` — Logger, anti-delete, utils
- `plugins/` — 89 feature plugins across 8 categories
- `basestore.js` — Message store implementation
- `public/index.html` — Web panel UI

## Plugin Categories (89 total)

### 🤖 AI
- `.gpt` / `.chatgpt` / `.ai` — Chat with GPT
- `.gemini` — Google Gemini AI
- `.imagine` / `.txt2img` — AI image generation (Pollinations)
- `.copilot` — GitHub Copilot AI
- `.lyrics` — Get song lyrics
- `.roast` — AI-powered fun roasts
- `.compliment` — Compliment a user
- `.ai-rank` — AI model leaderboard

### 🎮 Fun
- `.joke` — Random joke
- `.quote` / `.inspire` — Inspirational quotes
- `.fact` / `.funfact` — Random fun facts
- `.8ball` / `.magic8` — Magic 8-ball
- `.coinflip` — Flip a coin
- `.dice` / `.roll` — Roll dice
- `.rps` — Rock Paper Scissors
- `.ship` / `.love` — Compatibility meter
- `.truth` / `.dare` / `.tod` — Truth or Dare
- `.wyr` — Would You Rather
- `.numguess` / `.guess` — Number guessing game
- `.trivia` / `.quiz` — Trivia questions

### 🔧 Utility
- `.ping` — Bot latency
- `.uptime` — Bot uptime
- `.calc` / `.math` — Calculator
- `.time` / `.date` — Current time (any timezone)
- `.weather` — Weather for any city
- `.translate` / `.tr` — Translate text (60+ languages)
- `.wiki` / `.wikipedia` — Wikipedia search
- `.define` / `.dict` — Dictionary definitions
- `.shorten` — URL shortener
- `.qr` / `.qrcode` — Generate QR codes
- `.currency` / `.fx` — Currency converter
- `.remind` — Set a reminder (up to 60 min)
- `.poll` — Create a group poll
- `.profile` / `.pp` — Get profile picture
- `.b64encode` / `.b64decode` — Base64 encode/decode
- `.emojimix` — Mix two emojis
- `.cheat` — Quick command cheatsheet

### 📱 Media / Downloads
- `.sticker` — Image/video to sticker
- `.toimage` / `.s2img` — Sticker to image
- `.tts` / `.speak` — Text to speech
- `.ytmp3` / `.ytsong` — YouTube to MP3
- `.ytmp4` / `.ytvideo` — YouTube to MP4
- `.ig` / `.instagram` — Instagram photo/video downloader
- `.spotify` / `.sp` — Spotify song downloader
- `.play` — YouTube music player
- `.tiktok` — TikTok video downloader
- `.facebook` — Facebook video downloader
- `.ocr` / `.readtext` — Extract text from image

### 👥 Group Management
- `.tagall` / `.everyone` / `.all` — Mention all members
- `.kick` — Remove member
- `.add` — Add member
- `.promote` — Promote to admin
- `.demote` — Demote from admin
- `.listadmins` — List group admins
- `.mute` / `.unmute` — Mute/unmute group
- `.lock` / `.unlock` — Lock/unlock group settings
- `.antilink on/off` — Anti-link protection (auto-deletes links)
- `.welcome on/off` — Welcome new members
- `.goodbye on/off` — Farewell messages
- `.setgname` — Change group name
- `.setgdesc` — Change group description
- `.groupinfo` — Group information
- `.linkgc` — Get group invite link
- `.swgc` — Share group invite
- `.hidetag` — Mention without notifying
- `.getsw` — Get group welcome settings
- `.leave` — Bot leaves group

### ⚙️ Admin / Owner
- `.menu` / `.help` — Full command menu
- `.botinfo` / `.sysinfo` — Bot and system info
- `.mode private/public` — Switch bot mode
- `.setprefix` — Change command prefix
- `.setbio` — Set bot WhatsApp bio
- `.setname` / `.botnick` — Change bot display name
- `.status` — Send WhatsApp status
- `.statusview` — Toggle auto-read statuses
- `.fullpp` — Set bot profile picture
- `.owner` — Show owner info
- `.broadcast` / `.bc` — Broadcast to all chats
- `.block` / `.unblock` — Block/unblock contacts
- `.clearcache` — Clear plugin cache

## Running

- **Port**: 5000 (bound to `0.0.0.0`)
- **Start**: `node index.js`
- **Workflow**: "Start application" configured for webview on port 5000

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `PANEL_PASSWORD` — Panel login password (default: `CyberByteAi`)
- `MAX_SESSIONS` — Max concurrent WhatsApp sessions (default: 30)

## Deployment

- Target: VM (always-running for persistent WhatsApp connections)
- Run command: `node index.js`

## Panel Access

Default password: `CyberByteAi` (set in `config.js` or via `PANEL_PASSWORD` env var)
