const jwt = require("jsonwebtoken")
const generateAccessToken = (userId, role) => {
    
  return jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
}

 const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.JWT_SECRET_REFRESH, {
       expiresIn: process.env.REFRESH_TOKEN_LIFE || '7d'
     })
  return { refreshToken }
}

module.exports = {generateRefreshToken,generateAccessToken}