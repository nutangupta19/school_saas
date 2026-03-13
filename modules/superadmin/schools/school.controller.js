// const schoolService = require("./school.service")

const schoolService = require("./school.service")

const schoolController = {

  // ─── Register School ─────────────────────────────────────────────
  registerSchool: async (req, res, next) => {
    try {

      const superAdminId = req.user._id   // from auth middleware
console.log(superAdminId)
      const school = await schoolService.registerSchool({
        ...req.body,
        superAdminId
      })

      res.status(201).json({
        success: true,
        message: "School registered successfully",
        data: school
      })

    } catch (error) {
      next(error)
    }
  },

  // ─── Get All Schools ─────────────────────────────────────────────
  getAllSchools: async (req, res, next) => {
    try {

      const { page, limit, search, isActive } = req.query

      const result = await schoolService.getAllSchools({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        search,
        isActive
      })

      res.status(200).json({
        success: true,
        data: result
      })

    } catch (error) {
      next(error)
    }
  },

//   // ─── Get Single School ───────────────────────────────────────────
  getSchoolById: async (req, res, next) => {
    try {

      const { id } = req.params

      const school = await schoolService.getSchoolById(id)

      res.status(200).json({
        success: true,
        data: school
      })

    } catch (error) {
      next(error)
    }
  },

//   // ─── Activate / Deactivate School ────────────────────────────────
  toggleSchoolStatus: async (req, res, next) => {
    try {

      const { id } = req.params
      const { isActive } = req.body

      const school = await schoolService.toggleSchoolStatus(id, isActive)

      res.status(200).json({
        success: true,
        message: "School status updated",
        data: school
      })

    } catch (error) {
      next(error)
    }
  }

}

module.exports = schoolController