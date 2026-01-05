import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req) => ({
        folder: "profile-images",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    })
})

export const upload = multer({ storage: storage })