// const fs = require('fs')
// const path = require('path')
// const ejs = require('ejs')

const { validationResult } = require("express-validator")
const responseData = require("./responseData")

// const bcrypt = require('bcryptjs')
module.exports = {
parseMultipartJSONFields: (fields) => (req, res, next) => {
  if (!req.body) req.body = {}

  for (const field of fields) {
    const value = req.body[field]

    if (value && typeof value === "string") {
      const trimmed = value.trim()

      // Detect JSON safely
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          req.body[field] = JSON.parse(trimmed)
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `${field.toUpperCase()}_INVALID_JSON`
          })
        }
      }
    }
  }

  next()
},
validatorMiddleware: (req, res, next) => {
    const errors = validationResult(req)
    console.log('VALIDTION ERROR', errors)
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .json(responseData(errors.errors[0].msg, {}, req, false))
    } else {
      next()
    }
  },
}
