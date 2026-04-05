const express = require('express')
const Campaign = require('../models/Campaign')
const Donation = require('../models/Donation')

const router = express.Router()

// Simple bearer-token auth middleware
function adminAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

router.use(adminAuth)

// GET /api/admin/stats
router.get('/stats', async (_req, res) => {
  try {
    const [totalCampaigns, activeCampaigns, donations] = await Promise.all([
      Campaign.countDocuments(),
      Campaign.countDocuments({ isActive: true, deadline: { $gt: new Date() } }),
      Donation.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    ])
    const { total = 0, count = 0 } = donations[0] || {}
    res.json({ totalCampaigns, activeCampaigns, totalRaised: total, totalDonations: count })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/campaigns — all campaigns, no filter
router.get('/campaigns', async (_req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).limit(100)
    res.json(campaigns)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/admin/campaigns/:id/feature — toggle pin
router.patch('/campaigns/:id/feature', async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id)
    if (!c) return res.status(404).json({ error: 'Not found' })
    c.isFeatured = !c.isFeatured
    await c.save()
    res.json({ isFeatured: c.isFeatured })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/admin/campaigns/:id/toggle — activate / deactivate
router.patch('/campaigns/:id/toggle', async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id)
    if (!c) return res.status(404).json({ error: 'Not found' })
    c.isActive = !c.isActive
    await c.save()
    res.json({ isActive: c.isActive })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/donations — recent 30
router.get('/donations', async (_req, res) => {
  try {
    const donations = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('donorUsername amount campaignId donorMessage createdAt')
    res.json(donations)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
