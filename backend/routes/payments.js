const express = require('express')
const axios = require('axios')
const Campaign = require('../models/Campaign')
const Donation = require('../models/Donation')

const router = express.Router()

const PI_API_BASE = 'https://api.minepi.com/v2'

// Headers για τα Pi API calls
const piHeaders = () => ({
  Authorization: `Key ${process.env.PI_API_KEY}`,
  'Content-Type': 'application/json',
})

/**
 * POST /api/payments/approve
 *
 * Βήμα 1 του Pi payment flow.
 * Ο client μας στέλνει το paymentId — εμείς το εγκρίνουμε στο Pi API.
 */
router.post('/approve', async (req, res) => {
  const { paymentId } = req.body

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' })
  }

  try {
    // Κάλεσε το Pi API για approval
    await axios.post(
      `${PI_API_BASE}/payments/${paymentId}/approve`,
      {},
      { headers: piHeaders() }
    )

    // Δημιούργησε pending donation record
    await Donation.findOneAndUpdate(
      { paymentId },
      { paymentId, status: 'approved' },
      { upsert: true, new: true }
    )

    res.json({ success: true })
  } catch (err) {
    console.error('Payment approval error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Payment approval failed' })
  }
})

/**
 * POST /api/payments/complete
 *
 * Βήμα 2 του Pi payment flow.
 * Ο χρήστης επιβεβαίωσε στο Pi wallet — ολοκληρώνουμε server-side.
 */
router.post('/complete', async (req, res) => {
  const { paymentId, txid, campaignId, amount: clientAmount } = req.body

  if (!paymentId || !txid || !campaignId) {
    return res.status(400).json({ error: 'paymentId, txid, and campaignId are required' })
  }

  try {
    // Κάλεσε το Pi API για completion
    const piResponse = await axios.post(
      `${PI_API_BASE}/payments/${paymentId}/complete`,
      { txid },
      { headers: piHeaders() }
    )

    const paymentData = piResponse.data
    // Use Pi API amount if available, fall back to client-reported amount (sandbox)
    const amount = paymentData.amount || clientAmount

    // Ενημέρωσε το donation record
    await Donation.findOneAndUpdate(
      { paymentId },
      {
        paymentId,
        txid,
        campaignId,
        amount,
        donorPiUid: paymentData.user_uid,
        status: 'completed',
      },
      { upsert: true, new: true }
    )

    // Ενημέρωσε το campaign με το νέο ποσό
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raised: amount, donorCount: 1 },
    })

    res.json({ success: true, amount })
  } catch (err) {
    console.error('Payment completion error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Payment completion failed' })
  }
})

/**
 * POST /api/payments/incomplete
 *
 * Called when Pi SDK finds an incomplete payment from a previous session.
 * We must either complete or cancel it — otherwise the user's Pi is stuck.
 */
router.post('/incomplete', async (req, res) => {
  const { paymentId } = req.body
  if (!paymentId) return res.status(400).json({ error: 'paymentId required' })

  try {
    const existing = await Donation.findOne({ paymentId })

    if (existing && existing.status === 'completed') {
      // Already done — just acknowledge
      return res.json({ action: 'completed' })
    }

    // Cancel the incomplete payment so the user's funds are released
    await axios.post(
      `${PI_API_BASE}/payments/${paymentId}/cancel`,
      {},
      { headers: piHeaders() }
    )

    if (existing) {
      await Donation.findOneAndUpdate({ paymentId }, { status: 'cancelled' })
    }

    res.json({ action: 'cancelled' })
  } catch (err) {
    console.error('Incomplete payment handler error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to handle incomplete payment' })
  }
})

module.exports = router
