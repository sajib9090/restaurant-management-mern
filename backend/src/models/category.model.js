import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    category: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Category is required"],
    },
    category_slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Category slug is required"],
    },
  },
  { timestamps: true }
);

const Category = model("Category", CategorySchema);
export default Category;
