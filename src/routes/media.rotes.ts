import { Router } from "express";

import { upload } from "../middlewares/upload";
import { uploadImage } from "../controllers/media";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();
router.put(
  "/uploadImage",
  isAuthenticated,
  upload.single("image"),
  uploadImage
);

export default router;