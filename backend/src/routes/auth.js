const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone })

// POST /api/auth/signup — create account (saves to DB)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    const cleanEmail = String(email).toLowerCase().trim()
    const exists = await User.findOne({ email: cleanEmail })
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email: cleanEmail, phone: phone || '', password: hashed })
    res.status(201).json({ token: signToken(user._id), user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login — verify against DB
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const cleanEmail = String(email).toLowerCase().trim()
    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    res.json({ token: signToken(user._id), user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
