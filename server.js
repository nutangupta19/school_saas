require('dotenv').config()
const app = require('./app')
const SuperAdminModel = require('./central-db/models/SuperAdmin.model')
// const app            = require('./app')
// const SuperAdminModel = require('./central-db/models/SuperAdmin.model')
const connectDB = require('./configs/db')
// const app = require('./server')


const PORT = process.env.PORT || 4000

const seedSuperAdmin = async () => {
  try {
    const exists = await SuperAdminModel.findOne()
    if (exists) return  // Already seeded

    if (!process.env.SUPERADMIN_SEED_EMAIL || !process.env.SUPERADMIN_SEED_PASSWORD) {
      console.warn('⚠️  SUPERADMIN_SEED_EMAIL or SUPERADMIN_SEED_PASSWORD not set. Skipping seed.')
      return
    }
    await SuperAdminModel.create({
      name:         'Super Admin',
      email:        process.env.SUPERADMIN_SEED_EMAIL,
      password: process.env.SUPERADMIN_SEED_PASSWORD,
    })

    console.log(`🌱 SuperAdmin seeded: ${process.env.SUPERADMIN_SEED_EMAIL}`)
  } catch (err) {
    console.error('SuperAdmin seed failed:', err.message)
  }
}

const startServer = async () => {
  // 1. Connect to central DB
  await connectDB()

  // 2. Seed first SuperAdmin if none exists
  await seedSuperAdmin()

  // 3. Start Express
  app.listen(PORT, () => {
    console.log(`🚀 SMS Server running on port ${PORT}`)
    console.log(`📡 Central DB: Connected`)
 
  })
}

startServer()
