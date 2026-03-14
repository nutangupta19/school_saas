const AdminModel = require("../../../school-db/admin/Admin.model")
const getAdminModel = require("../../../school-db/admin/Admin.model")
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateTokens")

module.exports ={
    adminLogin :async ({ email, password, schoolDb }) => {
 
//   const User  = getAdminModel(schoolDb)
 
  const admin = await AdminModel.findOne({ email }).select('+passwordHash')
 
  const invalidErr = new Error('Invalid email or password.')
  invalidErr.statusCode = 401
 
  if (!admin) throw invalidErr
 
  if (admin.role !== 'admin') {
    const err = new Error('Access denied. This login is for school admins only.')
    err.statusCode = 403
    throw err
  }
 
  if (!admin.isActive) {
    const err = new Error('Your account has been deactivated. Contact the platform support.')
    err.statusCode = 403
    throw err
  }
 
  const isMatch = await admin.comparePassword(password)
  if (!isMatch) throw invalidErr
 
  const accessToken = generateAccessToken(admin._id, admin.role)
 
 

  const payload = {
    name : admin.name,
    email :admin.email,
    role : admin.role
  }
  const  {refreshToken}= generateRefreshToken(payload)

  await AdminModel.findByIdAndUpdate({_id:admin._id},{accessToken,refreshToken})

  return { admin, accessToken, refreshToken }
}
}