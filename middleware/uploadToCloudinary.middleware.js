const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})




const uploadToCloudinary = async (filePath, folder) => {
  // console.log(filePath, folder, fileType, 'uploadToCloudinary params---')
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto' // 👈 KEY FIX
  })

  console.log('☁️ Cloudinary upload:', {
    public_id: result.public_id,
    secure_url: result.secure_url
  })

  return {
    public_id: result.public_id,
    secure_url: result.secure_url
  }
}

module.exports = {
  cloudinary,
  uploadToCloudinary
}