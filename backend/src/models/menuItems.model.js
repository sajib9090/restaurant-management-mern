import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MenuItemsSchema = new Schema(
  {
    item_name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Item name is required"],
    },
    item_price: {
      type: Number,
      required: [true, "Item price is required"],
    },
    discount: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      ref: "Category",
    },
  },
  { timestamps: true }
);

const MenuItems = model("Menu-Item", MenuItemsSchema);
export default MenuItems;
