import mongoose from "mongoose";
import slugify from "slugify";
import Category from "../models/Category.js";

/* ======================================================
   CREATE CATEGORY (ADMIN)
====================================================== */
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, isFeatured, isActive, order, seo } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = slugify(name, { lower: true });

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isFeatured,
      isActive,
      order,
      seo,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE CATEGORY + ADD PACKAGES (ADMIN)
====================================================== */
export const updateCategory = async (req, res) => {
  try {
    const { packageIds, ...updateFields } = req.body;

    const updateQuery = {};

    // normal fields update
    if (Object.keys(updateFields).length) {
      // agar name change ho raha hai to slug bhi update karo
      if (updateFields.name) {
        updateFields.slug = slugify(updateFields.name, { lower: true });
      }

      updateQuery.$set = updateFields;
    }

    // packageIds add (single ya multiple)
    if (packageIds) {
      const idsArray = Array.isArray(packageIds)
        ? packageIds
        : [packageIds];

      updateQuery.$addToSet = {
        packages: {
          $each: idsArray.map((id) => new mongoose.Types.ObjectId(id)),
        },
      };
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // updated category with FULL active package data
    const category = await Category.aggregate([
      {
        $match: {
          _id: updated._id,
        },
      },
      {
        $lookup: {
          from: "packages",
          let: { packageIds: "$packages" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$packageIds"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "packages",
        },
      },
    ]);

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL CATEGORIES (ADMIN)
   - Active + Inactive
   - With packages
====================================================== */
export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "packages",
          let: { packageIds: "$packages" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$packageIds"] },
              },
            },
          ],
          as: "packages",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL CATEGORIES (PUBLIC)
   - Only active
   - Without package data (lightweight)
====================================================== */

export const getAllCategoriesPublic = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        // sirf active categories
        $match: {
          isActive: true,
        },
      },
      {
        // category ke andar packages lao
        $lookup: {
          from: "packages",
          let: { packageIds: "$packages" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$packageIds"] },
                    { $eq: ["$isActive", true] }, // sirf active packages
                  ],
                },
              },
            },
            {
              // frontend ke liye unnecessary fields hata do
              $project: {
                description: 0,
                itinerary: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: "packages",
        },
      },
      {
        // category order maintain
        $sort: { order: 1 },
      },
    ]);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ======================================================
   GET CATEGORY BY SLUG (PUBLIC)
   - With active packages
====================================================== */
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.aggregate([
      {
        $match: {
          slug: req.params.slug,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "packages",
          let: { packageIds: "$packages" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$packageIds"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "packages",
        },
      },
    ]);

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE CATEGORY (ADMIN)
====================================================== */
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
