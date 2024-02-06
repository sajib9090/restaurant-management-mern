import mongoose from "mongoose";
import createError from "http-errors";

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateId = (id) => {
  if (!isValidId(id)) {
    throw createError(400, "Invalid ID format.");
  }
};

export { validateId };
