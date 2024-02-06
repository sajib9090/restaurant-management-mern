import createError from "http-errors";
import Expense from "../models/expense.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";
import stringToNumber from "../helper/stringToNumber.js";
import User from "../models/user.model.js";

const handleCreateExpense = async (req, res, next) => {
  try {
    const { title, expense_amount, expense_creator } = req.body;

    if (!title || !expense_amount) {
      throw createError(400, "Title and Expense Amount are required fields");
    }

    const user = await User.findOne({ username: expense_creator });
    if (!user) {
      throw createError(400, "Unauthorized request. User could not found");
    }

    const trimmedExpenseName = title.trim().replace(/\s+/g, " ").toLowerCase();

    const expenseAmountValidation = stringToNumber(expense_amount);

    const newExpense = new Expense({
      title: trimmedExpenseName,
      expense_amount: expenseAmountValidation,
      expense_creator: user?.username,
    });

    const expense = await newExpense.save();

    res.status(200).send({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateExpense };
