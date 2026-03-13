const authService = require("./auth.service")
const { responseData } = require('../../../utils/responseData')

// const superAdminService = require("./superAdmin.service")

// ─── Login SuperAdmin ─────────────────────────────────────────────────────────
// const loginSuperAdmin = 

 const superAdminController= {

loginSuperAdmin: async (req, res, next) => {
  try {

    const { email, password } = req.body

    const { superAdmin, accessToken, refreshToken } =
      await authService.loginSuperAdmin({ email, password })

    return res.status(200).json(
      responseData(
        "LOGIN_SUCCESS",
        {
          superAdmin: {
            id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email
          },
          accessToken,
          refreshToken
        },
        req,
        true
      )
    )

  } catch (error) {

    return res.status(error.statusCode || 500).json(
      responseData(
        error.message || "SOMETHING_WENT_WRONG",
        null,
        req,
        false
      )
    )

  }
}
}

module.exports = superAdminController