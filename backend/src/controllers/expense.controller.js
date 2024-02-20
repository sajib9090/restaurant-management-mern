import createError from "http-errors";
import Expense from "../models/expense.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";
import stringToNumber from "../helper/stringToNumber.js";
import User from "../models/user.model.js";

const handleCreateExpense = async (req, res, next) => {
  try {
    const { title, expense_amount, expense_creator } = req.body;

    console.log(expense_creator);

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

const handleGetExpenses = async (req, res, next) => {
  try {
    const { id, month, startDate, endDate, specificDate } = req.query;
    const filter = {};

    if (id) {
      filter._id = id;
    }

    if (month) {
      const startOfMonth = new Date(month);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);
      endOfMonth.setUTCDate(0);
      filter.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
    }

    if (startDate) {
      filter.createdAt = { ...filter.createdAt, $gte: new Date(startDate) };
    }

    if (endDate) {
      filter.createdAt = { ...filter.createdAt, $lt: new Date(endDate) };
    }

    if (specificDate) {
      const date = new Date(specificDate);
      date.setUTCHours(0, 0, 0, 0);
      filter.createdAt = {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetExpensesByStartAndEndDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1)
        ),
      };
    }

    let pipeline = [
      { $match: query },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          expenses: { $push: "$$ROOT" },
          totalExpenses: { $sum: "$expense_amount" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    let result = await Expense.aggregate(pipeline).exec();

    res.status(200).send({
      success: true,
      message: "expense data retrieved successfully",
      expenses: result,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateId(id);

    const options = {};

    await findDataById(id, Expense, options, next);

    await Expense.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateExpense,
  handleGetExpenses,
  handleDeleteExpense,
  handleGetExpensesByStartAndEndDate,
};
