import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ExpenseSchema = new Schema({
  item_name: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Item name is required"],
  },
  creator: {
    type: String,
    required: [true, "Creator is required"],
    ref: "Users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = model("Expense", ExpenseSchema);
export default Expense;
