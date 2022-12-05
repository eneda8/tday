const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "t'day",
        allowed_formats: ["jpeg", "png", "jpg", "gif", "mp4", "webm", "mov"]
    }
});

module.exports = {
    cloudinary,
    storage
} 