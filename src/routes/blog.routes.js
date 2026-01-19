import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createBlog,
  getAllBlogs,
  getPublicBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { validate } from "../middleware/validate.js";
import { createBlogSchema, updateBlogSchema } from "../validators/blog.validator.js";

const router = express.Router();

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

// Get all PUBLIC blogs (for website)
router.get("/public", getPublicBlogs);

// Get single blog by ID (public)
router.get("/:id", getSingleBlog);

/**
 * =========================
 * ADMIN ROUTES (PROTECTED)
 * =========================
 */

// Create new blog
router.post("/", adminAuth,validate(createBlogSchema), createBlog);

// Get all blogs (admin: draft + public)
router.get("/", adminAuth, getAllBlogs);

// Update blog
router.put("/:id", adminAuth,validate(updateBlogSchema), updateBlog);

// Delete blog
router.delete("/:id", adminAuth, deleteBlog);

export default router;
