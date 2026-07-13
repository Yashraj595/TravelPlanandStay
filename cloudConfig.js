const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


Cloudinary.config( {
  cloud_name : process.env.CLOUD_NAME,
  api_key : process.env.CLOUD_SECRET,
  api_secret : process.env.CLOUD_API_SECRET

});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'travelandstay_DEV',
    allowerdFormats : ["png" , "jpg" , "jpeg"],
  
  },
});

module.exports = {

  cloudinary,
  storage

}