const { IgApiClient } = require('instagram-private-api')
const axios = require('axios')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'
const PORT = process.env.IG_PORT || 3002

let igUsername = process.env.IG_USERNAME || null
let igPassword = process.env.IG_PASSWORD || null

let ig = new IgApiClient()
const processedMessages = new Set()
let status = 'disconnected'
let connectedUsername = null
let pollInterval = null

async function startInstagram(username, password) {
  if (!username || !password) {
    console.log('[BizBuddy-IG] No credentials — service idle')
    status = 'no_credentials'
    return
  }

  // Stop existing poll loop if reconfiguring
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }

  ig = new IgApiClient()
  processedMessages.clear()
  status = 'connecting'

  try {
    ig.state.generateDevice(username)
    await ig.account.login(username, password)
    connectedUsername = username
    status = 'connected'
    console.log(`[BizBuddy-IG] Connected as @${username}`)

    await seedExistingMessages()
    pollInterval = setInterval(pollInbox, 6000)
  } catch (err) {
    status = 'error'
    connectedUsername = null
    console.error('[BizBuddy-IG] Login failed:', err.message)
  }
}

async function seedExistingMessages() {
  try {
    const feed = ig.feed.directInbox()
    const threads = await feed.items()
    for (const thread of threads) {
      if (thread.items?.[0]) processedMessages.add(thread.items[0].item_id)
    }
    console.log(`[BizBuddy-IG] Seeded ${processedMessages.size} existing messages`)
  } catch (err) {
    console.error('[BizBuddy-IG] Seed error:', err.message)
  }
}

async function pollInbox() {
  try {
    const feed = ig.feed.directInbox()
    const threads = await feed.items()

    for (const thread of threads) {
      const latestItem = thread.items?.[0]
      if (!latestItem) continue
      if (processedMessages.has(latestItem.item_id)) continue

      const isOwnMessage = String(latestItem.user_id) === String(thread.viewer_id)
      if (isOwnMessage || latestItem.item_type !== 'text') {
        processedMessages.add(latestItem.item_id)
        continue
      }

      processedMessages.add(latestItem.item_id)

      const messageText = latestItem.text || ''
      const senderId = String(latestItem.user_id)
      const threadId = thread.thread_id
      const senderUsername = thread.users?.[0]?.username || senderId

      console.log(`[BizBuddy-IG] DM from @${senderUsername}: ${messageText}`)

      try {
        const response = await axios.post(`${FASTAPI_URL}/api/whatsapp/incoming`, {
          phone: `ig_${senderId}`,
          message: messageText,
          session_id: `ig_${threadId}`,
        })
        const reply = response.data.reply
        await ig.entity.directThread(threadId).broadcastText(reply)
        console.log(`[BizBuddy-IG] Reply sent to @${senderUsername}`)
      } catch (replyErr) {
        console.error(`[BizBuddy-IG] Reply error:`, replyErr.message)
      }
    }
  } catch (err) {
    if (err.message?.includes('login_required')) {
      status = 'disconnected'
      connectedUsername = null
      if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
      console.error('[BizBuddy-IG] Session expired')
    } else {
      console.error('[BizBuddy-IG] Poll error:', err.message)
    }
  }
}

// ── API Endpoints ─────────────────────────────────────────────────────────────

app.get('/status', (req, res) => {
  res.json({ status, username: connectedUsername })
})

// Configure (or reconfigure) Instagram credentials from the dashboard
app.post('/configure', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }
  igUsername = username
  igPassword = password
  res.json({ message: 'Credentials received — attempting login…' })
  // Run async so response is sent immediately
  startInstagram(username, password)
})

app.post('/disconnect', async (req, res) => {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
  status = 'disconnected'
  connectedUsername = null
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`[BizBuddy-IG] Instagram service running on http://localhost:${PORT}`)
  startInstagram(igUsername, igPassword)
})
