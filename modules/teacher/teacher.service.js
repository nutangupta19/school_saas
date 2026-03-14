
const Teacher = require('../../school-db/teacher/Teacher.model.js')
const Document = require('../../school-db/document/document.model.js')
const User = require('../../school-db/users/users.model.js')
const { uploadToCloudinary } = require('../../middleware/uploadToCloudinary.middleware.js')

const teacherService = {
 registerTeacher: async (data, files) => {
  try {

    let {
      name,
      email,
      password,
      phone,
      dob,
      gender,
      address,
      bloodGroup,
      designation,
      qualifications,
      specialization,
      experience,
      dateOfJoining,
      classes,
      subjectsHandled,
      salaryInfo,
      emergencyContact
    } = data

    // ---------------- REQUIRED CHECK ----------------

    if (!name || !email || !password) {
      return { success: false, message: 'NAME_EMAIL_PASSWORD_REQUIRED' }
    }

    email = email.toLowerCase()

    // ---------------- CHECK USER ----------------

    const existUser = await User.findOne({ email })

    if (existUser) {
      return { success: false, message: 'EMAIL_ALREADY_EXISTS' }
    }

    // ---------------- CREATE USER ----------------

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'TEACHER'
    })

    // ---------------- PROFILE PIC ----------------

    let profilePic = null

    if (files?.profilePic && files.profilePic.length > 0) {

      const uploaded = await uploadToCloudinary(
        files.profilePic[0].path,
        'teachers/profile'
      )

      profilePic = {
        public_id: uploaded.public_id,
        secure_url: uploaded.secure_url
      }
    }

    // ---------------- GENERATE EMPLOYEE ID ----------------

    const employeeId = 'EMP-' + Date.now().toString().slice(-6)

    // ---------------- CREATE TEACHER ----------------

    const teacher = await Teacher.create({

      userId: user._id,
      employeeId,
      name,
      phone,
      dob,
      gender,
      address,
      bloodGroup,
      designation,
      qualifications,
      specialization,
      experience,
      dateOfJoining,
      classes,
      subjectsHandled,
      salaryInfo,
      emergencyContact,
      profilePic

    })

    // ---------------- DOCUMENT UPLOAD ----------------

    const allDocuments = []

    const addDoc = async (file, type, name) => {

      const uploaded = await uploadToCloudinary(
        file.path,
        'teachers/documents'
      )

      allDocuments.push({
        documentType: type,
        documentName: name,
        fileUrl: uploaded.secure_url
      })
    }

    if (files?.aadharFront && files.aadharFront.length > 0) {
      await addDoc(files.aadharFront[0], 'AADHAR', 'Aadhar Front')
    }

    if (files?.aadharBack && files.aadharBack.length > 0) {
      await addDoc(files.aadharBack[0], 'AADHAR', 'Aadhar Back')
    }

    // ---------------- SAVE DOCUMENT ----------------

    if (allDocuments.length > 0) {

      await Document.create({
        userId: user._id,
        documents: allDocuments
      })
    }

    // ---------------- SUCCESS ----------------

    return {
      success: true,
      message: 'TEACHER_REGISTERED_SUCCESSFULLY',
      data: teacher
    }

  } catch (error) {

    console.error("registerTeacher Error:", error)

    return {
      success: false,
      message: 'SERVER_ERROR',
      error: error.message
    }
  }
},
}

module.exports = teacherService
