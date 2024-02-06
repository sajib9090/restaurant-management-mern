import createError from "http-errors";
import Category from "../models/category.model.js";
import MenuItems from "../models/menuItems.model.js";
import stringValidation from "../helper/stringValidation.js";
import stringToNumber from "../helper/stringToNumber.js";

const handleCreateMenuItem = async (req, res, next) => {
  try {
    const { item_name, item_price, discount, category } = req.body;

    if (!item_name || !item_price || !category) {
      throw createError(400, "Item name, Item price and category is required.");
    }

    const itemNameValidation = stringValidation(item_name);
    const existingItemName = await MenuItems.findOne({
      item_name: itemNameValidation,
    });

    if (existingItemName) {
      throw createError(400, "Item name already exist");
    }

    const categoryValidation = stringValidation(category);
    const existingCategory = await Category.findOne({
      category_slug: categoryValidation,
    });
    if (!existingCategory) {
      throw createError(400, "Category not found.");
    }

    const priceValidation = stringToNumber(item_price);

    const newMenuItem = new MenuItems({
      item_name: itemNameValidation,
      item_price: priceValidation,
      category: categoryValidation,
    });

    // save to database
    const savedMenuItem = await newMenuItem.save();

    res.status(200).send({
      success: true,
      message: "Item created successfully",
      savedMenuItem,
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateMenuItem };
