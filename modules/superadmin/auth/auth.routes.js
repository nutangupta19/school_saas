// const 

const express = require("express")
const superAdminController = require("./auth.controller")
const router = express.Router()

// const { loginSuperAdmin } = require("./auth.controller")

// ─── Auth Routes ──────────────────────────────────────────────────────────────

router.post(
  "/login",
  superAdminController.loginSuperAdmin
)

module.exports = router