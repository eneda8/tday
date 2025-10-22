// Import required modules
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

// Configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "t'day",
        allowed_formats: ["jpeg", "png", "jpg", "gif", "mp4", "webm", "mov"]
    }
});

// Export the cloudinary module and storage for use in other parts of the application
module.exports = {
    cloudinary,
    storage
} 