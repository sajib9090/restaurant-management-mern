import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MembersSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "name is required"],
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, "mobile number is required"],
    },
    discountValue: {
      type: Number,
      required: true,
      default: 10,
    },
    total_discount: {
      type: Number,
    },
    total_spent: {
      type: Number,
    },
    invoices_code: {
      type: [String],
      default: [],
      validate: {
        validator: function (array) {
          return array.every(
            (code) => typeof code === "string" && code.length <= 25
          );
        },
      },
    },
  },
  { timestamps: true }
);

const Member = model("Member", MembersSchema);
export default Member;
