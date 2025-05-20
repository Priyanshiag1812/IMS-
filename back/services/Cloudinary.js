import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (req) => {
  try {
    if (!req.file || !req.file.path) {
      return null;
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "inventory",
    });
    fs.unlinkSync(req.file.path);

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
