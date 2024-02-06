import createError from "http-errors";
import Staff from "../models/staff.model.js";
import { validateId } from "../helper/validateId.js";
import findDataById from "../services/findDataById.js";

const handleCreateStaff = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw createError(400, "Name is required.");
    }

    const nameValidation = name.trim().replace(/\s+/g, " ").toLowerCase();

    if (/^[^a-zA-Z]/.test(nameValidation)) {
      throw createError(400, "Invalid name format.");
    }

    const existingName = await Staff.findOne({
      name: nameValidation,
    });

    if (existingName) {
      throw createError(400, "Name already exist");
    }

    const newStaffName = new Staff({
      name: nameValidation,
    });

    // save to database
    const savedStaff = await newStaffName.save();

    res.status(200).send({
      success: true,
      message: "Staff created successfully",
      savedStaff,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id);

    const options = {};
    const staff = await findDataById(id, Staff, options, next);

    await Staff.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { handleCreateStaff, handleDeleteStaff };
