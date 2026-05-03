import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();
router.post("/login", login);
router.post("/logout", (req, res) => res.json({ ok: true }));
export default router;
