import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TableSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Table name is required"],
    },
  },
  { timestamps: true }
);

const Table = model("Table", TableSchema);
export default Table;
