import { Router } from "express";

import { upload } from "../middlewares/upload";
import { uploadImage } from "../controllers/media";

const router = Router();
router.put(
  "/uploadImage",
  upload.single("image"),
  uploadImage
);

export default router;