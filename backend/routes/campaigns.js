const express = require('express')
const { body, validationResult } = require('express-validator')
const Campaign = require('../models/Campaign')
const Donation = require('../models/Donation')

const router = express.Router()

// GET /api/campaigns — Λίστα εγκεκριμένων καμπανιών
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isActive: true, isApproved: true, deadline: { $gt: new Date() } }
    if (category) filter.category = category

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 })
    res.json(campaigns)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/campaigns/:id — Λεπτομέρειες καμπάνιας
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    res.json(campaign)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/campaigns — Δημιουργία νέας καμπάνιας
router.post(
  '/',
  [
    body('title').trim().notEmpty().isLength({ max: 100 }),
    body('description').trim().notEmpty().isLength({ max: 500 }),
    body('category').isIn(['school', 'animal', 'sports', 'neighborhood', 'other']),
    body('goal').isFloat({ min: 1 }),
    body('organizer').trim().notEmpty(),
    body('durationDays').isInt({ min: 1, max: 90 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    try {
      const { title, description, category, goal, organizer, durationDays, imageUrl, creatorPiUid } = req.body
      const deadline = new Date(Date.now() + durationDays * 86400000)

      const { creatorUsername } = req.body
      const campaign = await Campaign.create({
        title,
        description,
        category,
        goal,
        organizer,
        deadline,
        imageUrl: imageUrl || '',
        creatorPiUid: creatorPiUid || '',
        creatorUsername: creatorUsername || '',
        isApproved: true,
      })

      res.status(201).json(campaign)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// PUT /api/campaigns/:id — Creator edits campaign
router.put(
  '/:id',
  [
    body('description').optional().trim().isLength({ max: 500 }),
    body('imageUrl').optional().trim(),
    body('extraDays').optional().isInt({ min: 1, max: 30 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg })

    try {
      const { creatorPiUid, description, imageUrl, extraDays } = req.body
      const campaign = await Campaign.findById(req.params.id)
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
      if (campaign.creatorPiUid && creatorPiUid !== campaign.creatorPiUid) {
        return res.status(403).json({ error: 'Only the campaign creator can edit' })
      }

      if (description !== undefined) campaign.description = description
      if (imageUrl !== undefined) campaign.imageUrl = imageUrl
      if (extraDays) campaign.deadline = new Date(campaign.deadline.getTime() + extraDays * 86400000)

      await campaign.save()
      res.json(campaign)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// PATCH /api/campaigns/:id/close — Creator closes campaign early
router.patch('/:id/close', async (req, res) => {
  try {
    const { creatorPiUid } = req.body
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    if (campaign.creatorPiUid && creatorPiUid !== campaign.creatorPiUid) {
      return res.status(403).json({ error: 'Only the campaign creator can close it' })
    }

    campaign.isActive = false
    await campaign.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/campaigns/:id/donors — Top donors for a campaign
router.get('/:id/donors', async (req, res) => {
  try {
    const donations = await Donation.find({
      campaignId: req.params.id,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('donorUsername donorMessage amount createdAt')

    res.json(donations)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/campaigns/:id/updates — Creator posts a progress update
router.post(
  '/:id/updates',
  [body('text').trim().notEmpty().isLength({ max: 300 })],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg })

    try {
      const { text, creatorPiUid } = req.body
      const campaign = await Campaign.findById(req.params.id)
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' })

      // Only the creator can post updates
      if (campaign.creatorPiUid && creatorPiUid !== campaign.creatorPiUid) {
        return res.status(403).json({ error: 'Only the campaign creator can post updates' })
      }

      campaign.updates.push({ text })
      await campaign.save()

      res.json(campaign.updates[campaign.updates.length - 1])
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

module.exports = router
