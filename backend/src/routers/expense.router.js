import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { handleCreateExpense } from "../controllers/expense.controller.js";

const ExpenseRouter = express.Router();

ExpenseRouter.post("/expense/add-expense", isLoggedIn, handleCreateExpense);

export default ExpenseRouter;
