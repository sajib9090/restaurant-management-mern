import mongoose from "mongoose";
const { Schema, model } = mongoose;

const StaffSchema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Staff name is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Staff = model("Staff", StaffSchema);
export default Staff;
