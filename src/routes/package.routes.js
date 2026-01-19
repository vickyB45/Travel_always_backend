import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createPackage,
  getAllPackages,
  getPublicPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
} from "../controllers/package.controller.js";
import { validate } from "../middleware/validate.js";
import { createPackageSchema, updatePackageSchema } from "../validators/package.validator.js";

const router = express.Router();

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

// Get all PUBLIC packages (website)
router.get("/public", getPublicPackages);

// Get single package by ID (public)
router.get("/:id", getSinglePackage);

/**
 * =========================
 * ADMIN ROUTES (PROTECTED)
 * =========================
 */

// Create new package
router.post("/", adminAuth,validate(createPackageSchema), createPackage);

// Get all packages (admin: draft + public)
router.get("/", adminAuth, getAllPackages);

// Update package
router.put("/:id", adminAuth,validate(updatePackageSchema), updatePackage);

// Delete package
router.delete("/:id", adminAuth, deletePackage);

export default router;
