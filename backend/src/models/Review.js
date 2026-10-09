const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  comment: { type: String, required: true },
  rating:  { type: Number, default: 5, min: 1, max: 5 },
  avatar:  { type: String, default: '' }, // initials fallback
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)
