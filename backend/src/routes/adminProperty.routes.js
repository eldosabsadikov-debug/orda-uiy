import { Router } from "express";
import { getAdminProperties } from "../controllers/property.controller.js";
import { createProperty, updateProperty, deleteProperty, changeStatus } from "../controllers/adminProperty.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAdmin);
router.get("/", getAdminProperties);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.patch("/:id/status", changeStatus);
export default router;
