const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn("⚠️  Cloudinary keys missing — upload API disabled, everything else works.");
}

const uploadToCloudinary = (buffer, folder = 'skill1-hire') => {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error("Cloudinary not configured on this server"));
  }
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "auto" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

module.exports = {
  uploadToCloudinary,
  isCloudinaryConfigured,
};
