import createError from "http-errors";
import Category from "../models/category.model.js";
import findDataById from "../services/findDataById.js";
import { validateId } from "../helper/validateId.js";

const handleGetCategories = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const regExSearch = new RegExp(".*" + search + ".*", "i");

    // necessary filter
    const filter = {
      category: { $regex: regExSearch },
    };

    const categories = await Category.find(filter).sort({ category: 1 });

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

    const normalizeString = category.trim().replace(/\s+/g, " ").toLowerCase();

    if (/^[^a-zA-Z]/.test(normalizeString)) {
      throw createError(400, "Invalid Category format.");
    }

    const existingCategory = await Category.findOne({
      category: normalizeString,
    });

    if (existingCategory) {
      throw createError(
        400,
        "Category already exist. Please use a different name."
      );
    }

    // Create a new category
    const newCategory = new Category({
      category: normalizeString,
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
    validateId(id);
    
    const options = {};
    // lets check data available with this id
    await findDataById(id, Category, options, next);

    await Category.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: `Category deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateCategory, handleGetCategories, handleDeleteCategory };
