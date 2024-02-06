import mongoose from "mongoose";
const { Schema, model } = mongoose;

const OrderLogSchema = new Schema({
  staff: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    ref: "Staff",
  },
  table_code: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    ref: "Table",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderLog = model("Order-log", OrderLogSchema);
export default OrderLog;
