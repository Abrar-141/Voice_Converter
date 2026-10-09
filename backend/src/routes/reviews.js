const express = require('express')
const router = express.Router()
const Review = require('../models/Review')

const DEFAULTS = [
  { name: 'Arjun Sharma',   comment: 'Absolutely mind-blowing! I called my German client and we spoke in our own languages. Zero awkward pauses.', rating: 5 },
  { name: 'Sara Ahmed',     comment: 'The auto-detection is insane. It switched from Urdu to English mid-sentence without missing a beat.', rating: 5 },
  { name: 'Carlos Rivera',  comment: 'Finally a tool that actually works in real-time. My Spanish team and I communicate effortlessly now.', rating: 5 },
  { name: 'Priya Nair',     comment: 'Used it for a business call with a Japanese partner. The latency was barely noticeable. Impressive!', rating: 5 },
  { name: 'James Okafor',   comment: 'End-to-end encryption gives me peace of mind. Voice quality is crystal clear even during translation.', rating: 5 },
]

// GET all reviews
router.get('/', async (req, res) => {
  try {
    let reviews = await Review.find().sort({ createdAt: -1 })
    if (reviews.length === 0) {
      reviews = await Review.insertMany(DEFAULTS)
    }
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create review
router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body)
    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
