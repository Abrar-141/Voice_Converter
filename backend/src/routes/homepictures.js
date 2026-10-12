const express = require('express')
const router = express.Router()
const HomePicture = require('../models/HomePicture')

// GET /api/homepictures — all pictures in slideshow order
router.get('/', async (req, res) => {
  try {
    res.json(await HomePicture.find().sort('order'))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/homepictures — save a new picture { image: base64 dataURL, alt }
router.post('/', async (req, res) => {
  try {
    const { image, alt } = req.body
    if (!image) return res.status(400).json({ error: 'image (base64 data URL) is required' })
    const last = await HomePicture.findOne().sort('-order')
    const picture = await HomePicture.create({
      image,
      alt: alt || 'Voice Converter',
      order: (last?.order ?? 0) + 1,
    })
    res.status(201).json(picture)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/homepictures/:id — update image / alt / order
router.put('/:id', async (req, res) => {
  try {
    const { image, alt, order } = req.body
    const picture = await HomePicture.findByIdAndUpdate(
      req.params.id,
      {
        ...(image !== undefined && { image }),
        ...(alt !== undefined && { alt }),
        ...(order !== undefined && { order }),
      },
      { new: true }
    )
    if (!picture) return res.status(404).json({ error: 'Picture not found' })
    res.json(picture)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/homepictures/:id — remove a picture
router.delete('/:id', async (req, res) => {
  try {
    const picture = await HomePicture.findByIdAndDelete(req.params.id)
    if (!picture) return res.status(404).json({ error: 'Picture not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router