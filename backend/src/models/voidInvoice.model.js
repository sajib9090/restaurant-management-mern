import mongoose from "mongoose";
const { Schema, model } = mongoose;

const itemSchema = new Schema({
  _id: {
    type: String,
    required: true,
    ref: "Menu-Item",
  },
  item_name: {
    type: String,
    required: true,
  },
  item_price_per_unit: {
    type: Number,
    required: true,
  },
  item_quantity: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
});

const VoidInvoiceSchema = new Schema(
  {
    serial_of_void: {
      type: Number,
      unique: true,
    },
    sold_invoice_id: {
      type: String,
      required: true,
      ref: "Sold-Invoice",
    },
    table_name: {
      type: String,
      required: true,
      ref: "Table",
    },
    void_quantity: {
      type: Number,
      required: true,
    },
    previous_quantity: {
      type: Number,
    },

    item: itemSchema,
  },
  { timestamps: true }
);

VoidInvoiceSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const invoiceCount = await this.model("Void-Invoice").countDocuments({});
    this.serial_of_void = invoiceCount + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const VoidInvoice = model("Void-Invoice", VoidInvoiceSchema);
export default VoidInvoice;
