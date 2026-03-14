const express = require("express")
const { login } = require("./auth.controller")

const router = express.Router()


router.post('/',login)

module.exports = router