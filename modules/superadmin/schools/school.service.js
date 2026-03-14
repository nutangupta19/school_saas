// const mongoose  = require('mongoose')

// const crypto    = require('crypto')
// const SchoolModel = require('../../../central-db/models/School.model')

// const getAdminModel = require('../../../school-db/admin/Admin.model')
// const AdminModel = require('../../../school-db/admin/Admin.model')

// // ─── Generate a random temp password ─────────────────────────────────────────
// const generateTempPassword = () => {
//   // Format: Sms@XXXXX (easy to read, meets most password policies)
//   const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
//   return `Sms@${rand}`
// }



// const schoolService = {
// registerSchool : async ({
//   name,
//   email,
//   phone,
//   address,
//   adminName,
//   adminEmail,
//   adminPhone,
//   superAdminId,
// }) => {

//   // 1. Check for duplicate school email or slug
// //   const slug = generateSlug(name)
// try{
//   const existingSchool = await SchoolModel.findOne({ $or: [{ email }, { phone },{adminEmail},{adminPhone}] })
//   if (existingSchool) {
//     const err = new Error(
//       existingSchool.email === email
//         ? 'A school with this email already exists.'
//         : 'A school with this name already exists. Try a different name.'
//     )
//     err.statusCode = 409
//     throw err
//   }



//   // 3. Create school record in central DB
//   const school = await SchoolModel.create({
//     name,
//     // slug,
//     email,
//     phone,
//     address,
//     // boardType,
//     // logoUrl:      logoUrl || null,
//     // dbUri:        schoolDbUri,
//     isActive:     true,
//     registeredBy: superAdminId,
//   })

  
//     const existingAdmin = await AdminModel.findOne({ email: adminEmail })
//     if (existingAdmin) {

//       await SchoolModel.findByIdAndDelete(school._id)

//       const err = new Error('Admin email already exists in school database.')
//       err.statusCode = 409
//       throw err
//     }
//     const tempPassword = generateTempPassword()
// console.log(tempPassword)
//     // Create the school admin
//     const admin = await AdminModel.create({
//         schoolId :school._id,
//       name:         adminName,
//       email:        adminEmail,
//       phone:        adminPhone || null,
//       password: "123456",   // will be hashed by pre-save hook
//       role:         'admin',
//       isActive:     true,
//     })

//     // 5. Send credentials email (non-blocking — don't await)
//     // sendSchoolAdminCredentials({
//     //   adminName,
//     //   schoolName: name,
//     //   email:      adminEmail,
//     //   password:   tempPassword,
//     //   loginUrl:   `${process.env.CLIENT_URL}/${slug}/login`,
//     // }).catch((err) => console.error('Failed to send credentials email:', err.message))

//     // await schoolConn.close()

//     return { school, adminId: admin._id }

//   } catch (err) {
  
 
//     console.log(err)
//   }
// },
//  getAllSchools : async ({ page = 1, limit = 20, search = '', isActive }) => {
//   const query = {}

//   if (search) {
//     query.$or = [
//       { name:  { $regex: search, $options: 'i' } },
//       { email: { $regex: search, $options: 'i' } },
//       { slug:  { $regex: search, $options: 'i' } },
//     ]
//   }

//   if (typeof isActive === 'boolean') query.isActive = isActive

//   const skip  = (page - 1) * limit
//   const total = await SchoolModel.countDocuments(query)
//   const schools = await SchoolModel.find(query)
//     .populate('registeredBy', 'name email')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)

//   return {
//     schools,
//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   }
// },
// getSchoolById : async (id) => {
//   const school = await SchoolModel.findById(id).populate('registeredBy', 'name email')
//   if (!school) {
//     const err = new Error('School not found.')
//     err.statusCode = 404
//     throw err
//   }
//   return school
// },
// toggleSchoolStatus : async (id, isActive) => {
//     console.log(typeof isActive)
//   const school = await SchoolModel.findByIdAndUpdate(
//     id,
//     { isActive },
//     { new: true }
//   )

//   if (!school) {
//     const err = new Error('School not found.')
//     err.statusCode = 404
//     throw err
//   }



//   return school
// }
// }
 



// module.exports = schoolService

const crypto = require("crypto")
const SchoolModel = require("../../../central-db/models/School.model")
const AdminModel = require("../../../school-db/admin/Admin.model")

const generateTempPassword = () => {
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase()
  return `Sms@${rand}`
}

const schoolService = {

  registerSchool: async ({
    name,
    email,
    phone,
    address,
    adminName,
    adminEmail,
    adminPhone,
    superAdminId,
  }) => {

    // Check duplicate school
    const existingSchool = await SchoolModel.findOne({
      $or: [{ email }, { phone }],
    })

    if (existingSchool) {
      const err = new Error("SCHOOL_ALREADY_EXISTS")
      err.statusCode = 409
      throw err
    }

    // Create school
    const school = await SchoolModel.create({
      name,
      email,
      phone,
      address,
      isActive: true,
      registeredBy: superAdminId,
    })

    // Check duplicate admin
    const existingAdmin = await AdminModel.findOne({ email: adminEmail })

    if (existingAdmin) {

      await SchoolModel.findByIdAndDelete(school._id)

      const err = new Error("ADMIN_EMAIL_ALREADY_EXISTS")
      err.statusCode = 409
      throw err
    }

    const tempPassword = generateTempPassword()

    const admin = await AdminModel.create({
      schoolId: school._id,
      name: adminName,
      email: adminEmail,
      phone: adminPhone || null,
      password: tempPassword,
      role: "admin",
      isActive: true,
    })

    return {
      school,
      admin: {
        id: admin._id,
        email: admin.email,
        tempPassword,
      },
    }
  },

  // ─── Get All Schools ─────────────────────────────
  getAllSchools: async ({ page = 1, limit = 20, search = "", isActive }) => {

    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    if (typeof isActive === "boolean") query.isActive = isActive

    const skip = (page - 1) * limit

    const total = await SchoolModel.countDocuments(query)

    const schools = await SchoolModel.find(query)
      .populate("registeredBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return {
      schools,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  // ─── Get School By ID ─────────────────────────────
  getSchoolById: async (id) => {

    const school = await SchoolModel.findById(id)
      .populate("registeredBy", "name email")

    if (!school) {
      const err = new Error("SCHOOL_NOT_FOUND")
      err.statusCode = 404
      throw err
    }

    return school
  },

  // ─── Toggle Status ─────────────────────────────
  toggleSchoolStatus: async (id, isActive) => {

    const school = await SchoolModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    )

    if (!school) {
      const err = new Error("SCHOOL_NOT_FOUND")
      err.statusCode = 404
      throw err
    }

    return school
  },
}

module.exports = schoolService