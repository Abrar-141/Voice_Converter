const mongoose = require('mongoose')

/* Pictures for the Home2 (dashboard) auto-changing slideshow — saved in MongoDB */
const homePictureSchema = new mongoose.Schema({
  order: { type: Number, default: 0 },          // slideshow position (1, 2, 3...)
  image: { type: String, required: true },      // base64 data URL
  alt: { type: String, default: 'Voice Converter' },
})

module.exports = mongoose.model('HomePicture', homePictureSchema)