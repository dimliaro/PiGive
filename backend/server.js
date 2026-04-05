require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const campaignsRouter = require('./routes/campaigns')
const paymentsRouter  = require('./routes/payments')
const adminRouter     = require('./routes/admin')

const app  = express()
const PORT = process.env.PORT || 3001

// CORS — allow Pi Browser origin + your Vercel frontend
app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server requests (no origin)
    if (!origin) return cb(null, true)
    // Allow any minepi.com subdomain (Pi Browser)
    if (origin.endsWith('.minepi.com') || origin === 'https://minepi.com') return cb(null, true)
    // Allow our frontend
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

app.use(express.json())

// Routes
app.use('/api/campaigns', campaignsRouter)
app.use('/api/payments',  paymentsRouter)
app.use('/api/admin',     adminRouter)

// Health check (used by UptimeRobot)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Rippl', version: '0.1.0' })
})

// Start HTTP server immediately so healthcheck passes right away
app.listen(PORT, () => console.log(`Rippl backend on port ${PORT}`))

// Connect to MongoDB (after server is already listening)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message))
