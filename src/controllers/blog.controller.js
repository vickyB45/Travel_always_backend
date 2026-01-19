import Blog from "../models/Blog.js";

/**
 * =========================
 * CREATE BLOG (ADMIN)
 * =========================
 * POST /api/blogs
 */
export const createBlog = async (req, res) => {
  try {
    const { title, highlight, desc, img, metaData, isActive } = req.body;

    if (!title || !highlight || !desc || !img) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const blog = await Blog.create({
      title,
      highlight,
      desc,
      img,
      metaData: metaData || [],
      isActive: isActive || "public",
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create blog",
    });
  }
};

/**
 * =========================
 * GET ALL BLOGS (ADMIN)
 * =========================
 * GET /api/blogs
 */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
};

/**
 * =========================
 * GET PUBLIC BLOGS (PUBLIC)
 * =========================
 * GET /api/blogs/public
 */
export const getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: "public" }).sort({
      createdAt: -1,
    });

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch public blogs",
    });
  }
};

/**
 * =========================
 * GET SINGLE BLOG (PUBLIC)
 * =========================
 * GET /api/blogs/:id
 */
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Public user should not see draft blogs
    if (blog.isActive === "draft") {
      return res.status(403).json({
        message: "This blog is not public",
      });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch blog",
    });
  }
};

/**
 * =========================
 * UPDATE BLOG (ADMIN)
 * =========================
 * PUT /api/blogs/:id
 */
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update blog",
    });
  }
};

/**
 * =========================
 * DELETE BLOG (ADMIN)
 * =========================
 * DELETE /api/blogs/:id
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete blog",
    });
  }
};
