
const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  employeeId: { type: String, unique: true },

  name: { type: String, required: true },

  profilePic: {
    public_id: String,
    secure_url: String
  },

  phone: { type: String },

  dob: { type: Date },

  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  walletBalance: { type: Number, default: 0 },

  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },

  bloodGroup: { type: String },

  physicalDisability: { type: Boolean, default: false },

  disabilityDetails: { type: String },

  designation: { type: String },

  qualifications: [{ type: String }],

  specialization: [String],

  experience: { type: Number },

  dateOfJoining: { type: Date, default: Date.now },

  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
subjectsHandled: [
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }
  }
],

  salaryInfo: {
    basic: Number,
    allowances: Number,
    deductions: Number,
    netSalary: Number
  },

  emergencyContact: {
    name: String,
    relation: String,
    phone: String,
    address: String
  },

  attendance: [
    {
      date: Date,
      status: {
        type: String,
        enum: ['present', 'absent', 'onLeave']
      }
    }
  ],

  leaves: [
    {
      type: String,
      fromDate: Date,
      toDate: Date,
      reason: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    }
  ],

  achievements: [
    {
      title: String,
      description: String,
      year: Number
    }
  ],

  classTeacherOf: {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    section: String
  },

  isRemoved: { type: Number, enum: [0, 1], default: 0 },

  removedAt: { type: Date },

  removedReason: { type: String },

  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },

  token: { type: String },

  refreshToken: { type: String }

},
{ timestamps: true ,
versionKey: false}
)

teacherSchema.index({ name: 1 })
teacherSchema.index({ dateOfJoining: -1 })
teacherSchema.index({ isRemoved: 1 })

module.exports = mongoose.model('Teacher', teacherSchema)