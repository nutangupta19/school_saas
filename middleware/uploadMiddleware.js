const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ---------------- MEMORY STORAGE ---------------- */

const storage = multer.memoryStorage();

/* ---------------- FILE FILTER ---------------- */

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".csv"];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

/* ---------------- MULTER INSTANCE ---------------- */

const uploads = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
});

/* ---------------- CREATE TMP PATH ---------------- */

const attachCSVTempPath = (req, res, next) => {
  try {
    if (!req.file) return next();
    const tmpDir = "/tmp";
    const fileName =
      "bulk-upload-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ".csv";
    const tempPath = path.join(tmpDir, fileName);
    fs.writeFileSync(tempPath, req.file.buffer);
    req.file.path = tempPath;
    next();
  } catch (error) {
    next(error);
  }
};

/* ---------------- ERROR HANDLER ---------------- */

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB.",
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

module.exports = {
  uploads,
  handleUploadErrors,
  attachCSVTempPath,
};
