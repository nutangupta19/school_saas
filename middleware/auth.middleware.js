const jwt         = require('jsonwebtoken')
// const getUserModel = require('../school-db/models/User.model')
const SuperAdmin   = require('../central-db/models/SuperAdmin.model')
const { getUserModel } = require('../school-db/academics/User.model')

// ─── Protect school routes ────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing or malformed.',
      })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Access token expired.'
          : 'Invalid access token.'
      return res.status(401).json({ success: false, message })
    }

    // schoolDb is attached by schoolResolver middleware (must run before protect)
    if (!req.schoolDb) {
      return res.status(500).json({
        success: false,
        message: 'School context missing. Ensure schoolResolver runs before protect.',
      })
    }

    const User = getUserModel(req.schoolDb)
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated.',
      })
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

// ─── Protect SuperAdmin routes ────────────────────────────────────────────────
const protectSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing or malformed.',
      })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      console.log(decoded)
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Access token expired.'
          : 'Invalid access token.'
      return res.status(401).json({ success: false, message })
    }

    if (decoded.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. SuperAdmin only.',
      })
    }

    const superAdmin = await SuperAdmin.findById(decoded.userId)

    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: 'SuperAdmin not found or account deactivated.',
      })
    }
console.log(superAdmin,"wesdhux")
    req.user = superAdmin
    next()
  } catch (err) {
    next(err)
  }
}

// ─── RBAC — authorize specific roles ─────────────────────────────────────────
// Usage: router.post('/students', protect, authorize('admin'), handler)
//        router.post('/attendance', protect, authorize('admin', 'teacher'), handler)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to perform this action.`,
      })
    }

    next()
  }
}

module.exports = { protect, protectSuperAdmin, authorize }