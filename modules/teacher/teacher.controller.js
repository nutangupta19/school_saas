// const { createNotification } = require('../../services/notifications/notification.service.js')
const adminTeacherService = require("../teacher/teacher.service.js");
const { responseData } = require("../../utils/responseData.js");
const Class = require("../../school-db/class/Class.model.js");
const Subject = require('../../school-db/class/Subject.model.js')
// const { uploads,handleUploadErrors, attachCSVTempPath} = require("../../middleware/uploadMiddleware.js");
// const {cloudinary,uploadToCloudinary,} = require("../../middleware/uploadToCloudinary.middleware.js");
const mongoose = require("mongoose");


module.exports = {
  registerTeacher: async (req, res) => {
    try {
      console.log(
        "Received teacher registration request:",
        req.body,
        req.files,
      );

      const data = req.body;
      const files = req.files || {};
      if (typeof data.classes === "string") {
        try {
          data.classes = JSON.parse(data.classes);
        } catch {}
      }

      if (typeof data.subjectsHandled === "string") {
        try {
          data.subjectsHandled = JSON.parse(data.subjectsHandled);
        } catch {}
      }
      if (data.classes && Array.isArray(data.classes)) {
        for (const c of data.classes) {
          if (!mongoose.Types.ObjectId.isValid(c)) {
            return res
              .status(400)
              .json(responseData("INVALID_CLASS_ID", {}, req, false));
          }
        }
        const classCount = await Class.countDocuments({
          _id: { $in: data.classes },
        });

        if (classCount !== data.classes.length) {
          return res
            .status(400)
            .json(responseData("CLASS_NOT_FOUND", {}, req, false));
        }

        data.classes = data.classes.map((c) => mongoose.Types.ObjectId(c));
      }
      if (data.subjectsHandled && Array.isArray(data.subjectsHandled)) {
        for (const s of data.subjectsHandled) {
          if (!mongoose.Types.ObjectId.isValid(s.classId)) {
            return res
              .status(400)
              .json(responseData("INVALID_CLASS_ID", {}, req, false));
          }
        }

        const subjectClassIds = data.subjectsHandled.map((s) => s.classId);
        const classCount = await Class.countDocuments({
          _id: { $in: subjectClassIds },
        });
        if (classCount !== subjectClassIds.length) {
          return res
            .status(400)
            .json(responseData("CLASS_NOT_FOUND", {}, req, false));
        }
        data.subjectsHandled = data.subjectsHandled.map((s) => ({
          ...s,
          classId: mongoose.Types.ObjectId(s.classId),
        }));
      }

      // ---------------- SERVICE ----------------

      const result = await adminTeacherService.registerTeacher(data, files);

      if (!result.success) {
        return res
          .status(400)
          .json(responseData(result.message, {}, req, false));
      }

      return res
        .status(201)
        .json(responseData(result.message, result.data, req, true));
    } catch (error) {
      console.error("registerTeacher Error:", error);

      return res
        .status(500)
        .json(
          responseData(error.message, { error: error.message }, req, false),
        );
    }
  },
};
