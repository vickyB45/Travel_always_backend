import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    highlight: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      required: true,
      trim: true,
    },

    img: {
      type: String,
      required: true,
    },

    // 🔥 Extra metadata / tags (flexible)
    metaData: {
      type: [String],
      default: [],
      // e.g. ["Travel Tips", "Budget Friendly", "Trending"]
    },

    // 🔥 Draft / Public control
    isActive: {
      type: String,
      enum: ["draft", "public"],
      default: "public",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
