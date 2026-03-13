


require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const superAdminRoutes = require("./modules/superadmin/auth/auth.routes")
const superAdminSchoolROutes  = require("./modules/superadmin/schools/school.routes")
const app = express()

// DB connection
// const connectDB = require('./configs/db')

const corsOption = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  exposedHeaders: ['x-access-token']
}

app.use(cors(corsOption))
app.use(morgan('dev'))


app.use(compression())
app.use(express.json())
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }))

// Root route
// app.get('/', (req, res) => {
//   res.send(`API is Running on Port ${process.env.PORT}`)
// })
app.use('/api/v1/superadmin', superAdminRoutes)
app.use('/api/v1/superadmin/school', superAdminSchoolROutes)

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Sorry, can't find that!",
    data: {}
  })
})

// ===================== START SERVER =====================

// connectDB()

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('✅ Server is running at PORT', process.env.PORT)
})
module.exports = app
