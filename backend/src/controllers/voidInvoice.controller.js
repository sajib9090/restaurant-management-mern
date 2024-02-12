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

    await updateSoldInvoice(voidInvoice);

    res.status(200).send({
      success: true,
      message: "void invoice created and sold invoice also updated",
      voidInvoice,
    });
  } catch (error) {
    next(error);
  }
};

const updateSoldInvoice = async (voidInvoice) => {
  try {
    const { sold_invoice_id, void_quantity, item } = voidInvoice;

    const existingInvoice = await SoldInvoice.findOne({ _id: sold_invoice_id });

    // console.log("item:", item._id, "invoice:", existingInvoice);
    const findExistingItemInsideSoldInvoice = existingInvoice?.items?.find(
      (i) => i?._id === item?._id
    );

    if (!findExistingItemInsideSoldInvoice) {
      throw createError(400, "This item is not found inside the sold invoice");
    }

    const updatedItem = {
      ...findExistingItemInsideSoldInvoice,
      item_quantity:
        findExistingItemInsideSoldInvoice?.item_quantity - void_quantity,
      void: true,
    };

    // Find the index for which index will updated
    const itemIndex = existingInvoice?.items?.findIndex(
      (i) => i._id === item._id
    );

    // Replace the old item with the updated item
    existingInvoice.items[itemIndex] = updatedItem;

    // Save the updated SoldInvoice
    await existingInvoice.save();
  } catch (error) {
    throw createError(error);
  }
};

export { handleCreateVoidInvoice };
