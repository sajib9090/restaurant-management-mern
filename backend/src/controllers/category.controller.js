import createError from "http-errors";
import Category from "../models/category.model.js";
import findDataById from "../services/findDataById.js";

const handleGetCategories = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const regExSearch = new RegExp(".*" + search + ".*", "i");

    // necessary filter
    const filter = {
      category: { $regex: regExSearch },
    };

    const categories = await Category.find(filter);

    res.status(200).send({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const handleCreateCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    const trimmedCategory = category.replace(/\s+/g, " ").trim();

    const categorySlug = trimmedCategory.replace(/\s+/g, "-");

    if (/^\d/.test(categorySlug)) {
      throw createError(400, "Invalid Category format.");
    }

    const existingCategory = await Category.findOne({
      category_slug: categorySlug,
    });

    if (existingCategory) {
      throw createError(
        400,
        "Category already exist. Please use a different name."
      );
    }

    // Create a new category
    const newCategory = new Category({
      category: trimmedCategory,
      category_slug: categorySlug,
    });

    // Save the category to the database
    await newCategory.save();
    // Response
    res.status(200).send({
      success: true,
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = {};

    const category = await findDataById(id, Category, options, next);

    if (category) {
      const deletedCategory = await Category.findByIdAndDelete(id);

      res.status(200).send({
        success: true,
        message: `Category deleted successfully.`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export { handleCreateCategory, handleGetCategories, handleDeleteCategory };
