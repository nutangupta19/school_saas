const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','teacher','student','parent'], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
})

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

const getUserModel = (conn) => conn.model('User', userSchema)

module.exports = getUserModel