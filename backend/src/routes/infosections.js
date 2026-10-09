const express = require('express')
const router = express.Router()
const InfoSection = require('../models/InfoSection')

const DEFAULTS = [
  { order: 1, icon: 'Mic2',         heading: 'Accent Adapting',          description: 'Our AI learns and adapts to regional accents in real-time, ensuring every word is understood regardless of dialect or pronunciation style.' },
  { order: 2, icon: 'BrainCircuit', heading: 'Context Awareness',        description: 'Smart contextual understanding means the AI grasps the meaning behind your words — not just the literal translation — for natural conversations.' },
  { order: 3, icon: 'MessageCircle',heading: 'Daily Slang Recognition',  description: 'From street slang to professional jargon, our model is trained on real-world conversations to handle informal language effortlessly.' },
  { order: 4, icon: 'ShieldCheck',  heading: 'Privacy First',            description: 'Zero data retention policy. Your voice is processed in real-time and never stored, ensuring complete privacy on every call.' },
  { order: 5, icon: 'Gauge',        heading: 'Ultra Low Latency',        description: 'Sub-second translation powered by edge computing. The gap between speaking and hearing the translation is virtually unnoticeable.' },
  { order: 6, icon: 'Globe2',       heading: '20+ Languages',            description: 'From Hindi to Spanish, Urdu to Japanese — communicate across 20+ languages with the same natural fluency as your mother tongue.' },
]

router.get('/', async (req, res) => {
  try {
    let items = await InfoSection.find().sort('order')
    if (items.length === 0) items = await InfoSection.insertMany(DEFAULTS)
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:order', async (req, res) => {
  try {
    const { icon, heading, description } = req.body
    const item = await InfoSection.findOneAndUpdate(
      { order: Number(req.params.order) },
      { icon, heading, description },
      { new: true, upsert: true }
    )
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
