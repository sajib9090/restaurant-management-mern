import createError from "http-errors";
import OrderLog from "../models/orderLog.model.js";
import Staff from "../models/staff.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";
import Table from "../models/table.model.js";

const handleCreateOrderLog = async (req, res, next) => {
  try {
    const { staff, table_code } = req.body;

    if (!staff || !table_code) {
      throw createError(400, "Staff and Table code are required fields");
    }

    if (/^[^a-zA-Z]/.test(staff)) {
      throw createError(400, "Invalid Staff format.");
    }

    const staffName = await Staff.findOne({ name: staff });
    if (!staffName) {
      throw createError(400, "Unauthorized request. Staff could not found");
    }

    if (/^[^a-zA-Z]/.test(table_code)) {
      throw createError(400, "Invalid Table format.");
    }

    const tableCode = await Table.findOne({ name: table_code });
    if (!tableCode) {
      throw createError(400, "Unauthorized request. Table could not found");
    }

    const existingOrderLog = await OrderLog.findOne({ table_code });
    if (existingOrderLog) {
      throw createError(400, "Order already running");
    }

    const newOrderLog = new OrderLog({
      staff: staff,
      table_code: table_code,
    });

    await newOrderLog.save();

    res.status(200).send({
      success: true,
      message: "Order Log created successfully",
      newOrderLog,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteOrderLog = async (req, res, next) => {
  try {
    const { table } = req.params;

    const orderLog = await OrderLog.findOne({ table_code: table });
    if (!orderLog) {
      throw createError(404, "Table does not exist");
    }

    await OrderLog.deleteOne({ table_code: table });

    res.status(200).send({
      success: true,
      message: "Order log deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateOrderLog, handleDeleteOrderLog };
