import Package from "../models/Package.js";
import Category from "../models/Category.js";

/**
 * =========================
 * CREATE PACKAGE (ADMIN)
 * =========================
 * POST /api/packages
 */
export const createPackage = async (req, res) => {
  try {
    const {
      title,
      img,
      desc,
      price,
      points,
      metaData,
      isPopular,
      isActive,
      category, // 👈 categoryId (optional)
    } = req.body;

    if (!title || !img || !desc || !price) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // 1️⃣ Create package
    const newPackage = await Package.create({
      title,
      img,
      desc,
      price,
      points: points || [],
      metaData: metaData || [],
      isPopular: isPopular || false,
      isActive: isActive || "public",
      category: category || null,
    });

    // 2️⃣ Sync → add package ID inside category
    if (category) {
      await Category.findByIdAndUpdate(category, {
        $addToSet: { packages: newPackage._id },
      });
    }

    return res.status(201).json(newPackage);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create package",
      error: error.message,
    });
  }
};

/**
 * =========================
 * GET ALL PACKAGES (ADMIN)
 * =========================
 * GET /api/packages
 */
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json(packages);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch packages",
    });
  }
};

/**
 * =========================
 * GET PUBLIC PACKAGES (PUBLIC)
 * =========================
 * GET /api/packages/public
 */
export const getPublicPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: "public" })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json(packages);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch public packages",
    });
  }
};

/**
 * =========================
 * GET SINGLE PACKAGE (PUBLIC)
 * =========================
 * GET /api/packages/:id
 */
export const getSinglePackage = async (req, res) => {
  try {
    const singlePackage = await Package.findById(req.params.id)
      .populate("category", "name slug");

    if (!singlePackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    // draft package public me nahi dikhega
    if (singlePackage.isActive === "draft") {
      return res.status(403).json({
        message: "This package is not public",
      });
    }

    return res.status(200).json(singlePackage);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch package",
    });
  }
};

/**
 * =========================
 * UPDATE PACKAGE (ADMIN)
 * =========================
 * PUT /api/packages/:id
 */
export const updatePackage = async (req, res) => {
  try {
    // 1️⃣ Purana package nikalo (category compare ke liye)
    const existingPackage = await Package.findById(req.params.id);
    if (!existingPackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    const oldCategoryId = existingPackage.category?.toString();
    const newCategoryId = req.body.category;

    // 2️⃣ Package update karo
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // 3️⃣ Category change sync
    if (newCategoryId && newCategoryId !== oldCategoryId) {
      // remove from old category
      if (oldCategoryId) {
        await Category.findByIdAndUpdate(oldCategoryId, {
          $pull: { packages: updatedPackage._id },
        });
      }

      // add to new category
      await Category.findByIdAndUpdate(newCategoryId, {
        $addToSet: { packages: updatedPackage._id },
      });
    }

    return res.status(200).json(updatedPackage);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update package",
      error: error.message,
    });
  }
};

/**
 * =========================
 * DELETE PACKAGE (ADMIN)
 * =========================
 * DELETE /api/packages/:id
 */
export const deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedPackage) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    // 🔥 Category se bhi package hatao
    if (deletedPackage.category) {
      await Category.findByIdAndUpdate(deletedPackage.category, {
        $pull: { packages: deletedPackage._id },
      });
    }

    return res.status(200).json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete package",
    });
  }
};
