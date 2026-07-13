const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// BUG FIX: "Cloudinary.config" tha (capital C) — Cloudinary naam ki
// koi variable define hi nahi thi, isse app start hote hi crash ho jaata.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'travelandstay_DEV',
    allowedFormats: ['png', 'jpg', 'jpeg'], // BUG FIX: "allowerdFormats" typo tha
  },
});

module.exports = {
  cloudinary,
  storage,
};
