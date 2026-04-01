require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const campaignsRouter = require('./routes/campaigns')
const paymentsRouter  = require('./routes/payments')

const app  = express()
const PORT = process.env.PORT || 3001

// CORS — allow Pi Browser origin + your Vercel frontend
const allowedOrigins = [
  'https://minepi.com',
  'https://*.minepi.com',
  process.env.FRONTEND_URL,        // e.g. https://pigive.vercel.app
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (server-to-server, curl) and allowed origins
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.replace('*', '')))) {
      return cb(null, true)
    }
    cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

app.use(express.json())

// Routes
app.use('/api/campaigns', campaignsRouter)
app.use('/api/payments',  paymentsRouter)

// Health check (used by UptimeRobot)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'PiGive', version: '0.1.0' })
})

// MongoDB + start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`PiGive backend on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
