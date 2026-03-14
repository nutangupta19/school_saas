const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const adminSchema = new mongoose.Schema(
{
   schoolId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: "School"
},
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
    enum: ["admin"],
    default: "admin"
  },
isActive:{
    type:Boolean,
    required:true
},
  accessToken: { type: String },
  refreshToken: { type: String }

},
{
  timestamps: true
}
)
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})



adminSchema.methods.comparePassword = async function (candidatePassword) {

  return bcrypt.compare(candidatePassword, this.password)

}
// const getAdminModel = (conn) => conn.model('Admin', adminSchema)

// module.exports = getAdminModel
module.exports = mongoose.model("Admin", adminSchema)