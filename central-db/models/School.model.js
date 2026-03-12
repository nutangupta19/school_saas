
const mongoose = require("mongoose")
const schoolSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  slug:         { type: String, required: true, unique: true, lowercase: true },
  email:        { type: String, required: true, unique: true },
  phone:        { type: String },
  address:      { type: String },
  logoUrl:      { type: String },                    // Cloudinary
//   boardType:    { type: String, enum: ['CBSE', 'State', 'International'] },
  dbUri:        { type: String, required: true },    // Full MongoDB URI for this school
  isActive:     { type: Boolean, default: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin' },
}, { timestamps: true })

module.exports = mongoose.model('School', schoolSchema)