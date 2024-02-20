import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateExpense,
  handleDeleteExpense,
  handleGetExpenses,
  handleGetExpensesByStartAndEndDate,
} from "../controllers/expense.controller.js";

const ExpenseRouter = express.Router();

ExpenseRouter.post("/expense/add-expense", isLoggedIn, handleCreateExpense);
ExpenseRouter.delete("/expense/delete/:id", isLoggedIn, handleDeleteExpense);

//this route can give data by id, month, specific date, start and end date also
ExpenseRouter.get("/expenses", handleGetExpenses);
ExpenseRouter.get(
  "/expenses/start-end-date",
  handleGetExpensesByStartAndEndDate
);

export default ExpenseRouter;
