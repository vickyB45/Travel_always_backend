import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  getSingleEnquiry,
  updateEnquiryStatus,
} from "../controllers/enquiry.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * @route   POST /api/enquiry
 * @desc    Create new enquiry (from frontend)
 * @access  Public
 */
router.post("/", createEnquiry);

/**
 * @route   GET /api/enquiry
 * @desc    Get all enquiries (admin)
 * @access  Admin (later auth)
 */
router.get("/",adminAuth, getAllEnquiries);

/**
 * @route   GET /api/enquiry/:id
 * @desc    Get single enquiry
 * @access  Admin
 */
router.get("/:id",adminAuth, getSingleEnquiry);

/**
 * @route   PATCH /api/enquiry/:id/status
 * @desc    Update enquiry status (admin)
 * @access  Admin
 */
router.patch("/:id/status",adminAuth, updateEnquiryStatus);

export default router;
