const express = require("express")
const router = express.Router()
const superAdminRoutes = require("../modules/superadmin/auth/auth.routes")
const superAdminSchoolROutes  = require("../modules/superadmin/schools/school.routes")
const adminAuthRouter = require("../modules/admin/auth/auth.routes")


router.use('/superadmin/school', superAdminSchoolROutes)

router.use('/superadmin', superAdminRoutes)


router.use('/admin/login',adminAuthRouter) 




module.exports = router