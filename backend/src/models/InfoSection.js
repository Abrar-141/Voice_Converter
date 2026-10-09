const mongoose = require('mongoose')

const infoSchema = new mongoose.Schema({
  order:       { type: Number, required: true, unique: true },
  icon:        { type: String, default: 'Zap' },
  heading:     { type: String, default: '' },
  description: { type: String, default: '' },
})

module.exports = mongoose.model('InfoSection', infoSchema)
