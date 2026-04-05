const express = require('express')
const { body, validationResult } = require('express-validator')
const Campaign = require('../models/Campaign')

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

      const campaign = await Campaign.create({
        title,
        description,
        category,
        goal,
        organizer,
        deadline,
        imageUrl: imageUrl || '',
        creatorPiUid: creatorPiUid || '',
        isApproved: true,
      })

      res.status(201).json(campaign)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

module.exports = router
