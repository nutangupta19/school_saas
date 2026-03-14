
const { adminLogin } = require("./auth.service")

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required."
        })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address."
        })
      }

      if (typeof password !== "string" || password.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Password cannot be empty."
        })
      }

      const { admin, accessToken, refreshToken } = await adminLogin({
        email: email.toLowerCase().trim(),
        password,
        schoolDb: req.schoolDb
      })

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
              _id: admin._id,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
           
       
          accessToken,
          refreshToken
        }
      })

    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        })
      }

      next(err)
    }
  }
}