const express = require("express")
const router = express.Router()
const { parseMultipartJSONFields } = require('../../utils/helper.js')
const { teacherDocFields } = require('../../middleware/multer.setup.js')
const validationRule = require('../../validations/teacher.auth.js')
const teacherController = require('../teacher/teacher.controller.js')

const jsonFieldsForTeacher = [
  'address',
  'qualifications',
  'subjectsHandled',
  'classes',
  'specialization',
  'salaryInfo',
  'emergencyContact'
]
router.post(
  '/register',
  teacherDocFields,
  parseMultipartJSONFields(jsonFieldsForTeacher),
   validationRule.validate('registerTeacher'),
  teacherController.registerTeacher
)

module.exports = router