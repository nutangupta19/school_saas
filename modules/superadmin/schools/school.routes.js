const express = require("express")
const router = express.Router()

const schoolController = require("./school.controller")

// Example auth middleware
// const authenticateSuperAdmin = require("../../../middleware/auth")

// ─── Register School ─────────────────────────────────────────────
router.post(
  "/",
  // authenticateSuperAdmin,
  schoolController.registerSchool
)

// ─── Get All Schools ─────────────────────────────────────────────
router.get(
  "/",
  // authenticateSuperAdmin,
  schoolController.getAllSchools
)

// ─── Get Single School ───────────────────────────────────────────
router.get(
  "/:id",
  // authenticateSuperAdmin,
  schoolController.getSchoolById
)

// ─── Activate / Deactivate School ────────────────────────────────
router.patch(
  "/:id/status",
  // authenticateSuperAdmin,
  schoolController.toggleSchoolStatus
)

module.exports = router