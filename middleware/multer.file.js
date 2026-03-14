const multer = require('multer')
const path = require('path')
const fs = require('fs')
const storage = multer.memoryStorage()

/* ---------------- FILE FILTER ---------------- */

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i)) {
    return cb(new Error('INVALID_FILE_TYPE'), false)
  }

  cb(null, true)
}

/* ---------------- MULTER INSTANCE ---------------- */

const uploadAssignmanet = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})

const uploadSubmission = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
})

/* ---------------- TMP FILE MIDDLEWARE ---------------- */

const attachTempFilePath = (req, res, next) => {
  try {
    if (!req.file) return next()

    const tmpDir = '/tmp'

    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(req.file.originalname)

    const tempPath = path.join(tmpDir, uniqueName)

    fs.writeFileSync(tempPath, req.file.buffer)

    req.file.path = tempPath

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  uploadAssignmanet,

  uploadSubmission,

  attachTempFilePath
}
