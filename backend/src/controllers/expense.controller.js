import createError from "http-errors";
import Expense from "../models/expense.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";

const handleCreateExpense = async (req, res, next) => {
  try {
    res.status(200).send({
      success: true,
      message: "Expense created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateExpense };
