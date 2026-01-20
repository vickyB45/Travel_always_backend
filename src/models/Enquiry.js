import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    arrival_date: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      default: 2,
      min: 1,
    },

    special_requests: {
      type: String,
      default: "",
    },

    /* 🔥 Admin workflow fields (future use) */
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "closed"],
      default: "new",
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", enquirySchema);
