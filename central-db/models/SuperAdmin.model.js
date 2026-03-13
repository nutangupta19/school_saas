const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const superAdminSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ["SUPER_ADMIN"],
    default: "SUPER_ADMIN"
  },

  accessToken: { type: String },
  refreshToken: { type: String }

},
{
  timestamps: true
}
)

superAdminSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()

})

superAdminSchema.methods.comparePassword = async function (candidatePassword) {

  return bcrypt.compare(candidatePassword, this.password)

}

module.exports = mongoose.model("SuperAdmin", superAdminSchema)