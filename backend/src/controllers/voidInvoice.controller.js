import createError from "http-errors";
import SoldInvoice from "../models/soldInvoice.model.js";
import VoidInvoice from "../models/voidInvoice.model.js";
import Staff from "../models/staff.model.js";
import Table from "../models/table.model.js";
import Member from "../models/member.model.js";
import stringToNumber from "../helper/stringToNumber.js";
import MenuItems from "../models/menuItems.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";

// need data: sold_invoice_id, table_name, void quantity and item
const handleCreateVoidInvoice = async (req, res, next) => {
  try {
    const { sold_invoice_id, table_name, void_quantity, item } = req.body;

    if (!sold_invoice_id || !table_name || !void_quantity || !item) {
      throw createError(
        400,
        "invoice id, table name, void quantity, and item are required field."
      );
    }

    //check valid id or not
    validateId(sold_invoice_id);

    // check sold invoice exist or not
    const options = {};
    const existInvoice = await findDataById(
      sold_invoice_id,
      SoldInvoice,
      options,
      next
    );

    // check table is exists or not, reason attacker can send lots of data
    const existTable = await Table.findOne({ name: table_name });
    if (!existTable) {
      throw createError(400, "table not found");
    }

    // convert if user send string my mistake
    const validateVoidQuantity = stringToNumber(void_quantity);

    // check
    validateId(item?._id);

    const existItemInsideSoldInvoice = existInvoice?.items?.find(
      (i) => i._id === item?._id
    );

    if (!existItemInsideSoldInvoice) {
      throw createError(400, "requested item not found");
    }

    const newVoidInvoice = new VoidInvoice({
      sold_invoice_id: existInvoice?._id,
      table_name: existInvoice?.table_name,
      void_quantity: validateVoidQuantity,
      previous_quantity: existItemInsideSoldInvoice?.item_quantity,
      item: {
        _id: existItemInsideSoldInvoice?._id,
        item_name: existItemInsideSoldInvoice?.item_name,
        item_price_per_unit: existItemInsideSoldInvoice?.item_price_per_unit,
        item_quantity: existItemInsideSoldInvoice?.item_quantity,
        total_price: existItemInsideSoldInvoice?.total_price,
      },
    });

    const voidInvoice = await newVoidInvoice.save();
    res.status(200).send({
      success: true,
      message: "Void invoice created",
      voidInvoice,
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateVoidInvoice };
