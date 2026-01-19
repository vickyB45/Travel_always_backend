import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createCategory,
  getAllCategoriesAdmin,
  getAllCategoriesPublic,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

/* ================= ADMIN ROUTES ================= */

// create category
router.post("/", adminAuth, createCategory);

// get all categories (admin – active + inactive)
router.get("/admin", adminAuth, getAllCategoriesAdmin);

// update category
router.put("/:id", adminAuth, updateCategory);

// delete category
router.delete("/:id", adminAuth, deleteCategory);

/* ================= PUBLIC ROUTES ================= */

// get all active categories
router.get("/", getAllCategoriesPublic);

// get single category with packages (by slug)
router.get("/:slug", getCategoryBySlug);

export default router;
