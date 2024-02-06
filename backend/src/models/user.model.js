import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcryptjs";

const UsersSchema = new Schema(
  {
    userSerial: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters."],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    isChairman: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UsersSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const userCount = await this.model("Users").countDocuments({});
    this.userSerial = userCount + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("Users", UsersSchema);
export default User;
