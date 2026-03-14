const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema(
  {
    className: { type: String, required: true }, // ONLY CLASS NAME
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
)
subjectSchema.index({ className: 1, name: 1 }, { unique: true })
module.exports = mongoose.model('Subject', subjectSchema)
