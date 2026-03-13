const mongoose  = require('mongoose')
// const School    = require('../../../central-db/models/School.model')
// const getUserModel = require('../../../school-db/models/User.model')
// const { evictSchoolConnection } = require('../../../middleware/schoolResolver.middleware')
// const { sendSchoolAdminCredentials } = require('../../../utils/sendEmail')
const crypto    = require('crypto')
const SchoolModel = require('../../../central-db/models/School.model')
const getUserModel = require('../../../school-db/academics/User.model')
const { evictSchoolConnection } = require('../../../middleware/schoolResolver.middleware')

// ─── Generate a random temp password ─────────────────────────────────────────
const generateTempPassword = () => {
  // Format: Sms@XXXXX (easy to read, meets most password policies)
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `Sms@${rand}`
}

// ─── Generate slug from school name ──────────────────────────────────────────
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             //  collapse multiple hyphens
}

const schoolService = {
registerSchool : async ({
  name,
  email,
  phone,
  address,
  adminName,
  adminEmail,
  adminPhone,
  superAdminId,
}) => {

  // 1. Check for duplicate school email or slug
  const slug = generateSlug(name)

  const existingSchool = await SchoolModel.findOne({ $or: [{ email }, { slug }] })
  if (existingSchool) {
    const err = new Error(
      existingSchool.email === email
        ? 'A school with this email already exists.'
        : 'A school with this name already exists. Try a different name.'
    )
    err.statusCode = 409
    throw err
  }

  // 2. Build the school's DB URI
  // Each school gets its own DB: sms_<slug>  e.g. sms_springdale
  const dbName = `sms_${slug.replace(/-/g, '_')}`

  // Use same cluster as central DB but different database name
  // Extract base URI from central URI (remove DB name part)
  const centralUri = process.env.CENTRAL_MONGO_URI
  // mongodb+srv://user:pass@cluster.mongodb.net/sms_central → .../sms_springdale
  const baseUri    = centralUri.substring(0, centralUri.lastIndexOf('/'))
  const schoolDbUri = `${baseUri}/${dbName}?retryWrites=true&w=majority`

  // 3. Create school record in central DB
  const school = await SchoolModel.create({
    name,
    slug,
    email,
    phone,
    address,
    // boardType,
    // logoUrl:      logoUrl || null,
    dbUri:        schoolDbUri,
    isActive:     true,
    registeredBy: superAdminId,
  })

  // 4. Connect to new school DB and create admin user
  let schoolConn
  try {
    schoolConn = mongoose.createConnection(schoolDbUri, {
      maxPoolSize:              5,
      serverSelectionTimeoutMS: 10000,
    })
    await schoolConn.asPromise()

    const User         = getUserModel(schoolConn)
    const tempPassword = generateTempPassword()

    // Check if admin email already exists in school DB (shouldn't but be safe)
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      // Rollback school creation
      await SchoolModel.findByIdAndDelete(school._id)
      await schoolConn.close()
      const err = new Error('Admin email already exists in school database.')
      err.statusCode = 409
      throw err
    }

    // Create the school admin
    const admin = await User.create({
      name:         adminName,
      email:        adminEmail,
      phone:        adminPhone || null,
      passwordHash: tempPassword,   // will be hashed by pre-save hook
      role:         'admin',
      isActive:     true,
    })

    // 5. Send credentials email (non-blocking — don't await)
    // sendSchoolAdminCredentials({
    //   adminName,
    //   schoolName: name,
    //   email:      adminEmail,
    //   password:   tempPassword,
    //   loginUrl:   `${process.env.CLIENT_URL}/${slug}/login`,
    // }).catch((err) => console.error('Failed to send credentials email:', err.message))

    await schoolConn.close()

    return { school, adminId: admin._id }

  } catch (err) {
    // Clean up if anything fails after school creation
    if (schoolConn) {
      try { await schoolConn.close() } catch (_) {}
    }
    // If school was created but admin setup failed — rollback
    if (school._id && !(err.statusCode === 409)) {
      await SchoolModel.findByIdAndDelete(school._id).catch(() => {})
    }
    throw err
  }
},
 getAllSchools : async ({ page = 1, limit = 20, search = '', isActive }) => {
  const query = {}

  if (search) {
    query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { slug:  { $regex: search, $options: 'i' } },
    ]
  }

  if (typeof isActive === 'boolean') query.isActive = isActive

  const skip  = (page - 1) * limit
  const total = await SchoolModel.countDocuments(query)
  const schools = await SchoolModel.find(query)
    .populate('registeredBy', 'name email')
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
getSchoolById : async (id) => {
  const school = await SchoolModel.findById(id).populate('registeredBy', 'name email')
  if (!school) {
    const err = new Error('School not found.')
    err.statusCode = 404
    throw err
  }
  return school
},
toggleSchoolStatus : async (id, isActive) => {
    console.log(typeof isActive)
  const school = await SchoolModel.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  )

  if (!school) {
    const err = new Error('School not found.')
    err.statusCode = 404
    throw err
  }

  // If deactivating, immediately kill the cached connection
  if (!isActive) {
    await evictSchoolConnection(school.slug)
  }

  return school
}
}
 



module.exports = schoolService