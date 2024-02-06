import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  category: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Category is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = model("Category", CategorySchema);
export default Category;
