import Enquiry from "../models/Enquiry.js";
import transporter from "../config/mail.js";
import { enquirySchema } from "../validators/enquery.validator.js";

export const createEnquiry = async (req, res) => {
  try {
    // 1️⃣ Zod validation
    const parsed = enquirySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const {
      name,
      email,
      phone,
      destination,
      arrival_date,
      guests,
      special_requests,
    } = parsed.data;

    // 2️⃣ Save to DB
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      destination,
      arrival_date: new Date(arrival_date),
      guests,
      special_requests,
    });

    // 3️⃣ SMTP Mail
    const mailOptions = {
      from: `"Travel Enquiry" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_ADMIN_EMAIL,
      replyTo: email,
      subject: `New Enquiry from ${name}`,
      html: `
        <h2>New Travel Enquiry</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><td><b>Name</b></td><td>${name}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Phone</b></td><td>${phone}</td></tr>
          <tr><td><b>Destination</b></td><td>${destination}</td></tr>
          <tr><td><b>Arrival Date</b></td><td>${arrival_date}</td></tr>
          <tr><td><b>Guests</b></td><td>${guests ?? 2}</td></tr>
          <tr><td><b>Special Requests</b></td><td>${special_requests ?? "-"}</td></tr>
        </table>
        <p><b>Enquiry ID:</b> ${enquiry._id}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      enquiry.emailSent = true;
      await enquiry.save();
    } catch (mailError) {
      console.error("MAIL ERROR ❌", mailError);
    }

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry._id,
    });
  } catch (error) {
    console.error("ENQUIRY ERROR ❌", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
/**
 * GET ALL ENQUIRIES
 * admin panel listing
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("GET ENQUIRIES ERROR ❌", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * GET SINGLE ENQUIRY
 */
export const getSingleEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("GET ENQUIRY ERROR ❌", error);
    res.status(500).json({
      success: false,
      message: "Invalid ID",
    });
  }
};

/**
 * UPDATE STATUS (Admin)
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    if (status) enquiry.status = status;
    if (adminNotes) enquiry.adminNotes = adminNotes;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry updated",
      data: enquiry,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR ❌", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
