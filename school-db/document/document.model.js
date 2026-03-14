const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
{
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  documents: [
    {
      documentType: {
        type: String,
        enum: [
          "AADHAR",
          "BIRTH_CERTIFICATE",
          "MARKSHEET",
          "TRANSFER_CERTIFICATE",
          "MEDICAL_RECORD",
          "OTHER"
        ],
        required: true
      },
      documentName: String,
      fileUrl: { type: String, required: true },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      issueDate: Date,
      remarks: String
    }
  ]
},
{ timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);