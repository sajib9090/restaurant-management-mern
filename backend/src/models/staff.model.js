import mongoose from "mongoose";
const { Schema, model } = mongoose;

const StaffSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Staff name is required"],
    },
  },
  { timestamps: true }
);

const Staffs = model("Staffs", StaffSchema);
export default Staffs;
