import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ExpenseSchema = new Schema({
  title: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Title is required"],
  },
  expense_amount: {
    type: Number,
    required: true,
  },
  expense_creator: {
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
