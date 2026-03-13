const express = require("express")
const router = express.Router()

const schoolController = require("./school.controller")
const { protectSuperAdmin } = require("../../../middleware/auth.middleware")
// const { protectSuperAdmin } = require("../../../middleware/auth.middleware")

// Example auth middleware
// const authenticateSuperAdmin = require("../../../middleware/auth.middleware")

// ─── Register School ─────────────────────────────────────────────
router.post(
  "/",
protectSuperAdmin,
  schoolController.registerSchool
)

// ─── Get All Schools ─────────────────────────────────────────────
router.get(
  "/",
  protectSuperAdmin,
  schoolController.getAllSchools
)

// // ─── Get Single School ───────────────────────────────────────────
router.get(
  "/:id", protectSuperAdmin,
  schoolController.getSchoolById
)

// // ─── Activate / Deactivate School ────────────────────────────────
router.patch(
  "/:id/status",
  protectSuperAdmin,
  schoolController.toggleSchoolStatus
)

module.exports = router