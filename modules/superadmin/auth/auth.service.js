
const SuperAdminModel = require("../../../central-db/models/SuperAdmin.model")
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateTokens")
// ─── Login SuperAdmin ─────────────────────────────────────────────────────────
const authService = {
loginSuperAdmin :async ({ email, password }) => {
  const superAdmin = await SuperAdminModel.findOne({ email })

  if (!superAdmin) {
    const err = new Error('Invalid credentials.')
    err.statusCode = 401
    throw err
  }

  const isMatch = await superAdmin.comparePassword(password)
  console.log("isMathc",isMatch)
  if (!isMatch) {
    const err = new Error('Invalid credentials.')
    err.statusCode = 401
    throw err
  }

  const accessToken = generateAccessToken(superAdmin._id, 'SUPER_ADMIN')

  const payload = {
    name : superAdmin.name,
    email :superAdmin.email,
    role : superAdmin.role
  }
  const  {refreshToken}= generateRefreshToken(payload)

  await SuperAdminModel.findByIdAndUpdate({_id:superAdmin._id},{accessToken,refreshToken})

  return { superAdmin, accessToken, refreshToken }
}
}




module.exports = 
  authService
  
