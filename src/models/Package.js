import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    img: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      required: true,
    },

    points: {
      type: [String],
      default: [],
    },

    metaData: {
      type: [String],
      default: [],
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: String,
      enum: ["draft", "public"],
      default: "public",
      required: true,
    },

    // 🔗 PACKAGE → CATEGORY (IMPORTANT)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true, // 🔥 fast filtering
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);
export default Package;
