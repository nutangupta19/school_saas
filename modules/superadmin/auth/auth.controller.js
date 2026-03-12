const authService = require("./auth.service")
// const superAdminService = require("./superAdmin.service")

// ─── Login SuperAdmin ─────────────────────────────────────────────────────────
// const loginSuperAdmin = 

 const superAdminController= {
  loginSuperAdmin :async (req, res, next) => {
  try {

    const { email, password } = req.body

    const { superAdmin, accessToken, refreshToken } =
      await authService.loginSuperAdmin({ email, password })

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        superAdmin: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email
        },
        accessToken,
        refreshToken
      }
    })

  } catch (error) {
    next(error)
  }
}
}

module.exports = superAdminController