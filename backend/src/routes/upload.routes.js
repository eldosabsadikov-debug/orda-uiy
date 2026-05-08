import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth.js";
import { uploadImages, deleteImages } from "../controllers/upload.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 30
  }
});

router.post("/", requireAdmin, upload.array("images", 30), uploadImages);
router.delete("/", requireAdmin, deleteImages);

export default router;