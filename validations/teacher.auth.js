const { body} = require('express-validator')
// const { responseData } = require('../utils/responseData')
const { validatorMiddleware } = require('../utils/helper')
const mongoose = require('mongoose')
module.exports.validate = (method) => {
  switch (method) {
    case 'registerTeacher': {
  return [

    // ---------------- NAME ----------------
    body('name')
      .notEmpty()
      .withMessage('NAME_REQUIRED')
      .isString()
      .withMessage('NAME_MUST_BE_STRING')
      .trim(),

    // ---------------- EMAIL ----------------
    body('email')
      .notEmpty()
      .withMessage('EMAIL_REQUIRED')
      .isEmail()
      .withMessage('VALID_EMAIL_REQUIRED')
      .normalizeEmail(),

    // ---------------- PASSWORD ----------------
    body('password')
      .notEmpty()
      .withMessage('PASSWORD_REQUIRED')
      .isLength({ min: 6 })
      .withMessage('PASSWORD_MIN_6'),

    // ---------------- PHONE ----------------
    body('phone')
      .optional()
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('PHONE_INVALID'),

    // ---------------- DOB ----------------
    body('dob')
      .optional()
      .isISO8601()
      .withMessage('DOB_INVALID')
      .toDate(),

    // ---------------- GENDER ----------------
    body('gender')
      .notEmpty()
      .withMessage('GENDER_REQUIRED')
      .isIn(['Male', 'Female', 'Other'])
      .withMessage('GENDER_INVALID'),

    // ---------------- BLOOD GROUP ----------------
    body('bloodGroup')
      .optional()
      .isString()
      .withMessage('BLOODGROUP_INVALID'),

    // ---------------- ADDRESS ----------------
    body('address')
      .notEmpty()
      .withMessage('ADDRESS_REQUIRED')
      .isObject()
      .withMessage('ADDRESS_OBJECT_REQUIRED'),

    body('address.street')
      .notEmpty()
      .withMessage('ADDRESS_STREET_REQUIRED'),

    body('address.city')
      .notEmpty()
      .withMessage('ADDRESS_CITY_REQUIRED'),

    body('address.state')
      .notEmpty()
      .withMessage('ADDRESS_STATE_REQUIRED'),

    // body('address.zip')
    //   .notEmpty()
    //   .withMessage('ADDRESS_ZIP_REQUIRED'),

    // ---------------- QUALIFICATIONS ----------------
    body('qualifications')
      .isArray({ min: 1 })
      .withMessage('QUALIFICATIONS_ARRAY_REQUIRED'),

    body('qualifications.*')
      .isString()
      .withMessage('QUALIFICATIONS_MUST_BE_STRING'),

    // ---------------- SPECIALIZATION ----------------
    body('specialization')
      .optional()
      .isArray()
      .withMessage('SPECIALIZATION_ARRAY_REQUIRED'),

    body('specialization.*')
      .optional()
      .isString()
      .withMessage('SPECIALIZATION_INVALID'),

    // ---------------- CLASSES ----------------
    body('classes')
      .isArray({ min: 1 })
      .withMessage('CLASSES_ARRAY_REQUIRED'),

    body('classes.*')
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('INVALID_CLASS_ID'),

    // ---------------- SUBJECTS HANDLED ----------------
    body('subjectsHandled')
      .optional()
      .isArray()
      .withMessage('SUBJECTS_ARRAY_REQUIRED'),

    body('subjectsHandled.*.classId')
      .optional()
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('INVALID_CLASS_ID'),

    body('subjectsHandled.*.subjectId')
      .optional()
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('INVALID_SUBJECT_ID'),

    // ---------------- EXPERIENCE ----------------
    body('experience')
      .optional()
      .isNumeric()
      .withMessage('EXPERIENCE_INVALID'),

    // ---------------- DATE OF JOINING ----------------
    body('dateOfJoining')
      .optional()
      .isISO8601()
      .withMessage('DATE_OF_JOINING_INVALID')
      .toDate(),

    // ---------------- SALARY ----------------
    body('salaryInfo')
      .optional()
      .isObject()
      .withMessage('SALARY_OBJECT_REQUIRED'),

    body('salaryInfo.basic')
      .optional()
      .isNumeric()
      .withMessage('SALARY_BASIC_INVALID'),

    body('salaryInfo.allowances')
      .optional()
      .isNumeric()
      .withMessage('SALARY_ALLOWANCES_INVALID'),

    body('salaryInfo.deductions')
      .optional()
      .isNumeric()
      .withMessage('SALARY_DEDUCTIONS_INVALID'),

    body('salaryInfo.netSalary')
      .optional()
      .isNumeric()
      .withMessage('SALARY_NET_INVALID'),

    // ---------------- EMERGENCY CONTACT ----------------
    body('emergencyContact')
      .optional()
      .isObject()
      .withMessage('EMERGENCY_CONTACT_OBJECT_REQUIRED'),

    body('emergencyContact.name')
      .optional()
      .isString()
      .withMessage('EMERGENCY_CONTACT_NAME_INVALID'),

    body('emergencyContact.relation')
      .optional()
      .isString()
      .withMessage('EMERGENCY_CONTACT_RELATION_INVALID'),

    body('emergencyContact.phone')
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('EMERGENCY_PHONE_INVALID'),

    validatorMiddleware
  ]
}
  }
}
