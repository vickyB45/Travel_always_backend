import express from "express";
import {
  adminLogin,
  adminLogout,
  adminMe,
} from "../controllers/auth.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login",authLimiter, adminLogin);
router.post("/logout", adminLogout);
router.get("/me", adminAuth, adminMe);

export default router;
