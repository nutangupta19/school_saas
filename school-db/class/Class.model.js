const mongoose = require('mongoose')

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        'Prep',
        'PreKG',
        'KG',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
      ]
    },

    streams: {
      type: String,
      enum: ['Commerce', 'Arts', 'Science-Math', 'Science-Biology'],
      required: function () {
        return this.name === '11' || this.name === '12'
      }
    },

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      }
    ],

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },

    section: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      default: 'A'
    },
    academicSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession'
    },

    studentCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)
classSchema.index({ name: 1, section: 1, streams: 1 }, { unique: true })

module.exports = mongoose.model('Class', classSchema)
