import User from "../models/user.model.js";
import createError from "http-errors";
import findDataById from "../services/findDataById.js";

const handleGetUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const regExSearch = new RegExp(".*" + search + ".*", "i");

    // necessary filter
    const filter = {
      username: { $regex: regExSearch },
    };

    const options = { password: 0 };
    const users = await User.find(filter, options);

    res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findDataById(id, User, options, next);
    res
      .status(200)
      .send({ success: true, message: "User retrieved successfully", user });
  } catch (error) {
    next(error);
  }
};

const handleDeleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    const user = await findDataById(id, User, options, next);

    if (user) {
      const deletedUser = await User.findByIdAndDelete(id);

      res.status(200).send({
        success: true,
        message: `User deleted successfully username:${deletedUser.username}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

const handleProcessRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw createError(400, "Username is required");
    }

    const normalizeString = username.trim().replace(/\s+/g, " ").toLowerCase();

    if (/^[^a-zA-Z]/.test(normalizeString)) {
      throw createError(400, "Invalid Category format.");
    }
    // Validation: Username must start with a letter, and be at least 3 characters long
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/;
    if (!usernameRegex.test(normalizeString)) {
      throw createError(
        400,
        "Username must be at least 3 characters and not more than 32 characters. Don't use space "
      );
    }

    if (!password || password.length < 6) {
      throw createError(
        400,
        "Password must be at least 6 characters long. Please provide a valid password."
      );
    }

    // check existingUser
    const existingUser = await User.exists({
      username: username,
    });

    if (existingUser) {
      throw createError(
        "409",
        "User already exist with this username. Please sign in"
      );
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
    });

    // Save the user to the database
    await newUser.save();

    const createdUser = newUser.toObject();
    delete createdUser.password;
    // Respond with the validation user
    res.status(200).send({
      success: true,
      createdUser,
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleGetUsers,
  handleProcessRegister,
  handleGetUser,
  handleDeleteUser,
};
