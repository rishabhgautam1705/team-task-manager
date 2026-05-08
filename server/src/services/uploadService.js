import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return { secure_url: filePath, public_id: "" };
  }

  return cloudinary.uploader.upload(filePath, {
    folder: "teamtask",
    resource_type: "auto",
  });
};
