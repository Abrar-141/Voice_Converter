const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
  order: { type: Number, required: true, unique: true },
  heading: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [String],
  img: { type: String, default: '' }, // base64 string
})

module.exports = mongoose.model('Feature', featureSchema)
