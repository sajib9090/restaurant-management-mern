import createError from "http-errors";
import SoldInvoice from "../models/soldInvoice.model.js";
import Staff from "../models/staff.model.js";
import Table from "../models/table.model.js";
import Member from "../models/member.model.js";
import stringToNumber from "../helper/stringToNumber.js";
import MenuItems from "../models/menuItems.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";

const handleCreateInvoice = async (req, res, next) => {
  try {
    const { table_name, served_by, member, total_bill, total_discount, items } =
      req.body;

    // check require field
    if (!table_name || !served_by || !total_bill || !items) {
      throw createError(
        400,
        "table, staff, total bill and items are required fields"
      );
    }

    //check request table name exist or not
    const foundTable = await Table.findOne({ name: table_name });
    if (!foundTable) {
      throw createError(400, "table not found");
    }
    //check request staff name exist or not
    const foundStaff = await Staff.findOne({ name: served_by });
    if (!foundStaff) {
      throw createError(400, "staff not found");
    }

    // Check if the member field is provided and not null
    let foundMember = null;
    if (member !== null && member !== undefined) {
      foundMember = await Member.findOne({ mobile: member });
      if (!foundMember) {
        throw createError(400, "member not found");
      }
    }

    const validateTotalBill = stringToNumber(total_bill);
    const validateTotalDiscount = stringToNumber(total_discount);

    const memberValue =
      member === null || member === undefined ? null : foundMember?.mobile;

    // Checking all sold item valid or not
    // attacker can push lot's of data if this validation not available
    const areAllIdsValid = await Promise.all(
      items?.map(async (item) => {
        const menuItem = await MenuItems.findOne({ _id: item?._id });
        return menuItem !== null;
      })
    );

    if (areAllIdsValid.includes(false)) {
      throw createError(400, "Every item must have a valid _id");
    }

    const newInvoice = new SoldInvoice({
      table_name: foundTable?.name,
      served_by: foundStaff?.name,
      member: memberValue,
      total_bill: validateTotalBill,
      total_discount: validateTotalDiscount,
      items: req.body.items,
    });

    await newInvoice.save();

    res.status(200).send({
      success: true,
      message: "Sold Invoice Created",
      data: newInvoice,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetAllSoldInvoices = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const regExSearch = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        { member: { $regex: regExSearch } },
        { served_by: { $regex: regExSearch } },
        { table_name: { $regex: regExSearch } },
      ],
    };

    const invoices = await SoldInvoice.find(filter).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "successfully found invoices",
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetInvoicesByDate = async (req, res, next) => {
  try {
    const { date } = req.params;

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!isValidDate) {
      throw createError(
        400,
        "invalid date format. please use the format YYYY-MM-DD."
      );
    }

    const parsedDate = new Date(date);

    const invoices = await SoldInvoice.find({
      createdAt: {
        $gte: parsedDate,
        $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).send({
      success: true,
      message: "invoices retrieved successfully",
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetSingleSoldInvoiceByFrId = async (req, res, next) => {
  try {
    const { fr_id } = req.params;

    if (!fr_id) {
      throw createError(400, "fr id is required");
    }

    const parsedId = parseInt(fr_id);

    const existingInvoice = await SoldInvoice.findOne({ fr_id: parsedId });

    if (!existingInvoice) {
      throw createError(400, "invoice not found");
    }
    res.status(200).send({
      success: true,
      message: "successfully found invoice",
      invoice: existingInvoice,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetSingleSoldInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createError(400, "id is required");
    }

    validateId(id);

    const existingInvoice = await SoldInvoice.findOne({ _id: id });

    if (!existingInvoice) {
      throw createError(400, "invoice not found");
    }
    res.status(200).send({
      success: true,
      message: "successfully found invoice",
      invoice: existingInvoice,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetSoldInvoicesByMonth = async (req, res, next) => {
  try {
    const { month } = req.params;

    const isValidMonth = /^[1-9]|1[0-2]$/.test(month);
    if (!isValidMonth) {
      throw createError(400, "Invalid month parameter.");
    }

    const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
    const endOfMonth = new Date(
      new Date(startOfMonth).setUTCMonth(startOfMonth.getUTCMonth() + 1) - 1
    );

    const invoices = await SoldInvoice.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const dailyTotals = {};
    const staffSellRecord = {};

    // Process invoices to calculate daily totals and staff sell record
    invoices.forEach((invoice) => {
      const invoiceDate = invoice.createdAt.toISOString().split("T")[0];

      // Calculate daily totals
      if (!dailyTotals[invoiceDate]) {
        dailyTotals[invoiceDate] = {
          daily_sell: 0,
          daily_discount: 0,
        };
      }

      dailyTotals[invoiceDate].daily_sell += invoice.total_bill;
      dailyTotals[invoiceDate].daily_discount += invoice.total_discount;

      // Calculate staff sell record
      const servedBy = invoice.served_by; // Assuming 'served_by' is the staff field
      if (!staffSellRecord[servedBy]) {
        staffSellRecord[servedBy] = {};
      }

      staffSellRecord[servedBy][invoiceDate] =
        (staffSellRecord[servedBy][invoiceDate] || 0) + invoice.total_bill;
    });

    // Convert dailyTotals object to an array
    const dailyTotalsArray = Object.entries(dailyTotals).map(
      ([date, totals]) => ({
        createdDate: date,
        ...totals,
      })
    );

    // Convert staffSellRecord object to an array
    const staffSellRecordArray = Object.entries(staffSellRecord).map(
      ([staff, sellRecord]) => ({
        staff,
        sellRecord: Object.entries(sellRecord).map(([date, sum]) => ({
          createdAt: date,
          sum,
        })),
      })
    );

    // Find max and min totals
    const maxSell = Math.max(
      ...dailyTotalsArray.map((totals) => totals.daily_sell)
    );
    const maxSellDate = dailyTotalsArray.find(
      (totals) => totals.daily_sell === maxSell
    ).createdDate;

    const minSell = Math.min(
      ...dailyTotalsArray.map((totals) => totals.daily_sell)
    );
    const minSellDate = dailyTotalsArray.find(
      (totals) => totals.daily_sell === minSell
    ).createdDate;

    res.status(200).send({
      success: true,
      message: "Invoices and daily totals retrieved successfully",
      invoices,
      dailySellSummary: dailyTotalsArray,
      minMaxSummary: { maxSellDate, maxSell, minSellDate, minSell },
      staffSellRecord: staffSellRecordArray,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteSoldInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    // checker for valid id or not
    validateId(id);

    // check invoice exist or not
    const options = {};
    await findDataById(id, SoldInvoice, options, next);
    //perform delete operation
    await SoldInvoice.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Successfully deleted sold invoice",
    });
  } catch (error) {
    next(error);
  }
};
export {
  handleCreateInvoice,
  handleDeleteSoldInvoice,
  handleGetSingleSoldInvoiceByFrId,
  handleGetSingleSoldInvoiceById,
  handleGetAllSoldInvoices,
  handleGetInvoicesByDate,
  handleGetSoldInvoicesByMonth,
};
