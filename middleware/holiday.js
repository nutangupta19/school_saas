const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = 'uploads/students'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'bulk-upload-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.csv']
  const fileExt = path.extname(file.originalname).toLowerCase()

  if (allowedExtensions.includes(fileExt)) {
    cb(null, true)
  } else {
    cb(new Error('Only CSV files are allowed'), false)
  }
}

const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: fileFilter
})

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      })
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  next()
}

module.exports = { uploads, handleUploadErrors }
