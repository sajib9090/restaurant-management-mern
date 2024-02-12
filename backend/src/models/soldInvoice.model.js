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
  table_name: {
    type: String,
    required: true,
  },
  total_price: {
    type: Number,
  },
});

const SoldInvoiceSchema = new Schema(
  {
    fr_id: {
      type: Number,
      unique: true,
    },
    table_name: {
      type: String,
      required: true,
      ref: "Table",
    },
    served_by: {
      type: String,
      required: true,
      ref: "Staff",
    },
    member: {
      type: String,
      ref: "Member",
      default: null,
    },
    total_bill: {
      type: Number,
    },
    total_discount: {
      type: Number,
      default: 0,
    },
    items: [itemSchema],
  },
  { timestamps: true }
);

SoldInvoiceSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const invoiceCount = await this.model("Sold-Invoice").countDocuments({});
    this.fr_id = invoiceCount + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const SoldInvoice = model("Sold-Invoice", SoldInvoiceSchema);
export default SoldInvoice;
