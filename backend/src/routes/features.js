const express = require('express')
const router = express.Router()
const Feature = require('../models/Feature')

const DEFAULTS = [
  {
    order: 1,
    heading: 'Real-Time Voice Translation',
    description: 'Speak naturally in your language and let our AI instantly translate your voice to the listener in their preferred language — with zero awkward delays.',
    tags: ['Live AI', 'Zero Delay', 'Natural Speech'],
    img: '',
  },
  {
    order: 2,
    heading: 'Smart Language Detection',
    description: 'No need to manually select languages. Our engine auto-detects what you speak and switches translation on the fly — supporting 20+ languages seamlessly.',
    tags: ['Auto-Detect', '20+ Languages', 'Smart Switch'],
    img: '',
  },
  {
    order: 3,
    heading: 'End-to-End Encrypted Calls',
    description: 'Every conversation is fully encrypted from end to end. Your voice data is never stored or shared — privacy is built into the core of every call.',
    tags: ['AES-256', 'Zero Logs', 'GDPR Ready'],
    img: '',
  },
]

// GET /api/features — return all 3, seed if empty
router.get('/', async (req, res) => {
  try {
    let features = await Feature.find().sort('order')
    if (features.length === 0) {
      features = await Feature.insertMany(DEFAULTS)
    }
    res.json(features)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/features/:order — update one feature
router.put('/:order', async (req, res) => {
  try {
    const { heading, description, tags, img } = req.body
    const feature = await Feature.findOneAndUpdate(
      { order: Number(req.params.order) },
      { heading, description, tags, img },
      { new: true, upsert: true }
    )
    res.json(feature)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
