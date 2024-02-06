import createError from "http-errors";
import Member from "../models/member.model.js";
import findDataById from "../services/findDataById.js";
import stringToNumber from "../helper/stringToNumber.js";
import { validateId } from "../helper/validateId.js";

const handleGetMembers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;

    const regExSearch = new RegExp(".*" + search + ".*", "i");

    // necessary filter
    const filter = {
      $or: [
        { name: { $regex: regExSearch } },
        { mobile: { $regex: regExSearch } },
      ],
    };

    const members = await Member.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Member.find(filter).countDocuments();

    // Response
    res.status(200).send({
      success: true,
      message: "Members retrieved successfully",
      members,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleGetMember = async (req, res, next) => {
  try {
    const { mobile } = req.params;

    if (mobile.length !== 11) {
      throw createError(
        400,
        "Mobile number must be exactly 11 numeric characters."
      );
    }

    const member = await Member.findOne({ mobile });
    if (!member) {
      throw createError(400, "Could not find any member with this number");
    }

    // Response
    res.status(200).send({
      success: true,
      message: "Member retrieved successfully",
      member,
    });
  } catch (error) {
    next(error);
  }
};

const handleEditMember = async (req, res, next) => {
  try {
    const mobile = req.params.mobile;
    const updatedFields = req.body;

    if (mobile.length !== 11) {
      throw createError(
        400,
        "Mobile number must be exactly 11 numeric characters."
      );
    }

    const member = await Member.findOne({ mobile });
    if (!member) {
      throw createError(400, "Could not found any member with this number");
    }

    // Update member fields
    const currentTotalDiscount = member.total_discount || 0;
    const newTotalDiscount = stringToNumber(updatedFields.total_discount) || 0;

    updatedFields.total_discount = currentTotalDiscount + newTotalDiscount;

    const currentTotalSpent = member.total_spent || 0;
    const newTotalSpent = stringToNumber(updatedFields.total_spent) || 0;
    updatedFields.total_spent = currentTotalSpent + newTotalSpent;

    // Append new invoices_code values to the existing array
    if ("invoices_code" in updatedFields) {
      updatedFields.invoices_code = [
        ...(member.invoices_code || []),
        ...(Array.isArray(updatedFields.invoices_code)
          ? updatedFields.invoices_code
          : [updatedFields.invoices_code]),
      ];
    }

    const updatedMember = await Member.findOneAndUpdate(
      { mobile },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    res.status(200).send({
      success: true,
      message: `Member updated successfully.`,
      updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

const handleCreateMember = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;

    if (!(name && mobile)) {
      throw createError(400, "Name and Mobile are required fields");
    }
    const trimmedName = name.trim().replace(/\s+/g, " ").toLowerCase();
    if (/^\d/.test(trimmedName)) {
      throw createError(400, "Invalid name format.");
    }

    const trimmedMobile = mobile.replace(/\s+/g, "").trim(); // Remove all spaces
    // Validate mobile number
    const mobileRegex = /^\d{11}$/;
    if (!mobileRegex.test(trimmedMobile)) {
      throw createError(
        400,
        "Mobile number must be exactly 11 numeric characters."
      );
    }

    const existingMember = await Member.findOne({ mobile: trimmedMobile });

    if (existingMember) {
      throw createError(400, "Already exist a member with this mobile number");
    }

    const newMember = new Member({
      name: trimmedName,
      mobile: trimmedMobile,
      discountValue: 10,
    });

    const result = await newMember.save();

    // Response
    res.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteMember = async (req, res, next) => {
  try {
    const id = req.params.id;
    validateId(id);
    const options = {};

    const member = await findDataById(id, Member, options, next);
    if (member) {
      await Member.findByIdAndDelete(id);

      res.status(200).send({
        success: true,
        message: `Member deleted successfully.`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateMember,
  handleDeleteMember,
  handleGetMembers,
  handleGetMember,
  handleEditMember,
};
