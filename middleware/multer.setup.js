const { createUploader, attachFilePath } = require("./multerUpload");

const imageMime = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
];
const docMime = ["application/pdf"];
const uploadStudentDocs = createUploader({
  allowedMime: [...imageMime, ...docMime],
  maxSize: 20 * 1024 * 1024,
});
const uploadTeacherDocs = createUploader({
  allowedMime: [...imageMime, ...docMime],
  maxSize: 20 * 1024 * 1024,
});
const uploadSchoolLogo = createUploader({
  allowedMime: [...imageMime],
  maxSize: 20 * 1024 * 1024,
});
const uploadProfilePics = createUploader({
  allowedMime: imageMime,
  maxSize: 30 * 1024 * 1024,
});
const uploadAnnouncement = createUploader({
  allowedMime: imageMime,
  maxSize: 30 * 1024 * 1024,
});

/* ---------------- STUDENT DOCS ---------------- */

const studentDocFields = [
  uploadStudentDocs.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "marksheets", maxCount: 10 },
    { name: "certificates", maxCount: 10 },
    { name: "medicalRecords", maxCount: 10 },
    { name: "transferCertificate", maxCount: 1 },
  ]),
  attachFilePath,
];

/* ---------------- TEACHER DOCS ---------------- */

const teacherDocFields = [
  uploadTeacherDocs.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
  ]),
  attachFilePath
]

/* ---------------- SCHOOL DOCS ---------------- */

const schoolDoc = [
  uploadSchoolLogo.fields([
    { name: "schoolLogo", maxCount: 1 },
    { name: "banner", maxCount: 4 },
    { name: "gallery", maxCount: 20 },
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `socialLogos[${i}]`,
      maxCount: 1,
    })),
  ]),
  attachFilePath,
];

/* ---------------- ADMIN PROFILE ---------------- */

const adminDoc = [
  uploadProfilePics.fields([{ name: "profilePic", maxCount: 1 }]),
  attachFilePath,
];

/* ---------------- ANNOUNCEMENTS ---------------- */

const announcement = [
  uploadAnnouncement.fields([{ name: "attachments", maxCount: 5 }]),
  attachFilePath,
];

/* ---------------- CATEGORY IMAGES ---------------- */

const categoryImagesUpload = [
  createUploader({
    allowedMime: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024,
  }).array("images", 20),
  attachFilePath,
];

/* ---------------- ABOUT IMAGES ---------------- */

const aboutImagesUpload = [
  createUploader({
    allowedMime: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024,
  }).array("images", 20),
  attachFilePath,
];

/* ---------------- LEADERSHIP IMAGE ---------------- */

const leadershipImageUpload = [
  createUploader({
    allowedMime: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024,
  }).single("profilephoto"),
  attachFilePath,
];

/* ---------------- STUDENT MARKSHEET ---------------- */

const studentMarksheetFields = [
  uploadStudentDocs.fields([{ name: "marksheet", maxCount: 1 }]),
  attachFilePath,
];

module.exports = {
  studentDocFields,
  teacherDocFields,
  schoolDoc,
  adminDoc,
  announcement,
  categoryImagesUpload,
  aboutImagesUpload,
  leadershipImageUpload,
  studentMarksheetFields,
};
