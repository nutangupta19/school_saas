const { getUserModel } = require('../../school-db/academics/User.model')
const { generateRefreshToken } = require('../../utils/generateTokens')

const loginUser = async ({ email, password, schoolDb, ipAddress, userAgent }) => {
  const User = getUserModel(schoolDb)

  const user = await User.findOne({ email })

  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials.')
    err.statusCode = 401
    throw err
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    const err = new Error('Invalid credentials.')
    err.statusCode = 401
    throw err
  }

  const accessToken  = generateAccessToken(user._id, user.role)
  const refreshToken= generateRefreshToken(user)
  return { user, accessToken, refreshToken }
}


// ─── Get my profile ───────────────────────────────────────────────────────────
const getMyProfile = async ({ userId, schoolDb }) => {
  const User = getUserModel(schoolDb)
  const user = await User.findById(userId)

  if (!user) {
    const err = new Error('User not found.')
    err.statusCode = 404
    throw err
  }

  return user
}

module.exports = { loginUser, refreshUserToken, logoutUser, getMyProfile }