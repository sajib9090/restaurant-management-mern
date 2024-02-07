import createError from "http-errors";
import SoldInvoice from "../models/soldInvoice.model.js";
import Staff from "../models/staff.model.js";
import Table from "../models/table.model.js";
import Member from "../models/member.model.js";
import stringToNumber from "../helper/stringToNumber.js";
import MenuItems from "../models/menuItems.model.js";

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

export { handleCreateInvoice };
