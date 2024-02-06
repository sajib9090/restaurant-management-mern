import createError from "http-errors";
import Category from "../models/category.model.js";
import MenuItems from "../models/menuItems.model.js";
import stringToNumber from "../helper/stringToNumber.js";
import findDataById from "../services/findDataById.js";
import { validateId } from "../helper/validateId.js";

const handleCreateMenuItem = async (req, res, next) => {
  try {
    const { item_name, item_price, category } = req.body;

    if (!item_name || !item_price || !category) {
      throw createError(400, "Item name, Item price and category is required.");
    }

    const itemNameValidation = item_name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

    if (/^[^a-zA-Z]/.test(itemNameValidation)) {
      throw createError(400, "Invalid item name format.");
    }
    const existingItemName = await MenuItems.findOne({
      item_name: itemNameValidation,
    });

    if (existingItemName) {
      throw createError(400, "Item name already exist");
    }

    const categoryValidation = category
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

    if (/^[^a-zA-Z]/.test(categoryValidation)) {
      throw createError(400, "Invalid category format.");
    }

    const existingCategory = await Category.findOne({
      category: categoryValidation,
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

const handleGetMenuItems = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const regExSearch = new RegExp(".*" + search + ".*", "i");

    // necessary filter
    const filter = {
      item_name: { $regex: regExSearch },
    };

    const menuItems = await MenuItems.find(filter).sort({ item_name: 1 });

    res.status(200).send({
      success: true,
      message: "Item retrieved successfully",
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteMenuItems = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateId(id);

    const options = {};
    const menuItem = await findDataById(id, MenuItems, options, next);
    if (menuItem) {
      await MenuItems.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Item deleted successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

const handleEditMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    validateId(id);

    const options = {};
    const menuItem = await findDataById(id, MenuItems, options, next);
    if (menuItem) {
      if (
        updatedData.item_name &&
        updatedData.item_name === menuItem.item_name
      ) {
        throw createError(400, "Item name already exist");
      }
      // Update the data in the database
      const result = await MenuItems.updateOne(
        { _id: id },
        { $set: updatedData }
      );

      if (result.modifiedCount > 0) {
        res.status(200).send({
          success: true,
          message: "Item updated successfully",
        });
      } else {
        res.status(404).send({
          success: false,
          message: "No changes were made",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
export {
  handleCreateMenuItem,
  handleGetMenuItems,
  handleDeleteMenuItems,
  handleEditMenuItem,
};
