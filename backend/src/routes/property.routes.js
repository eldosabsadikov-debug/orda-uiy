import { Router } from "express";
import { getProperties, getProperty } from "../controllers/property.controller.js";

const router = Router();
router.get("/", getProperties);
router.get("/:id", getProperty);
export default router;
