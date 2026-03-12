const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, sparse: true },
  phone:        { type: String },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin','teacher','student','parent'], required: true },
//   avatarUrl:    { type: String },                    // Cloudinary
  isActive:     { type: Boolean, default: true },
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

userSchema.methods.comparePassword = async function(plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

// Factory — called with school's mongoose connection
export const getUserModel = (conn) => conn.model('User', userSchema)