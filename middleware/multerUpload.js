
const multer = require('multer')

const fs = require('fs')

const path = require('path')

// Vercel compatible storage

const storage = multer.memoryStorage()

const createUploader = ({
  allowedMime = [],

  maxSize = 5 * 1024 * 1024
}) => {
  const fileFilter = (req, file, cb) => {
    if (allowedMime.length === 0 || allowedMime.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false)
    }
  }

  return multer({
    storage,

    fileFilter,

    limits: { fileSize: maxSize }
  })
}



const attachFilePath = (req, res, next) => {
  try {
    if (!req.files && !req.file) return next()

    const saveFile = (file) => {
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`

      const tempPath = path.join('/tmp', fileName)

      fs.writeFileSync(tempPath, file.buffer)

      // simulate diskStorage

      file.path = tempPath
    }

    if (req.file) {
      saveFile(req.file)
    }

    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach(saveFile)
      } else {
        Object.keys(req.files).forEach((field) => {
          req.files[field].forEach(saveFile)
        })
      }
    }
    next()
  } catch (error) {
    console.error(error)
    next(error)
  }
}
module.exports = {
  createUploader,
  attachFilePath
}
