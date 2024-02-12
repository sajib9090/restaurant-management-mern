import createError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { accessTokenSecret, refreshTokenSecret } from "../../secret.js";
import createJWT from "../helper/jwt.js";

const handleLoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw createError(400, "Username is required");
    }

    // Validation: Username must start with a letter, and be at least 3 characters long
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/;
    if (!usernameRegex.test(username)) {
      throw createError(
        400,
        "Invalid username format. Username must be at least 3 characters and not more than 32 characters "
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      next(createError.Unauthorized("Invalid username. Cannot find any user."));
      return;
    }

    if (!password || password.length < 6) {
      throw createError(
        400,
        "Password must be at least 6 characters long. Please provide a valid password."
      );
    }

    //MATCH PASSWORD
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      next(createError.Unauthorized("Invalid Password"));
      return;
    }

    //CHECK USER BANNED OR NOT
    if (user.isBanned) {
      next(
        createError.Unauthorized("You are banned. Please contact authority")
      );
      return;
    }

    // first make user object then delete a key value by using delete from the object
    const loggedInUser = user.toObject();
    delete loggedInUser.password;

    //TOKEN COOKIE
    const accessToken = await createJWT({ user }, accessTokenSecret, "1m");
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 1000, // 1 minute in milliseconds
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const refreshToken = await createJWT({ user }, refreshTokenSecret, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // success response
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      userInfo: loggedInUser,
    });
  } catch (error) {
    next(error);
  }
};

const handleLogoutUser = async (req, res, next) => {
  try {
    // console.log(req.user);
    if (!req.user) {
      throw createError.Unauthorized("User is not authenticated");
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    //success response
    res.status(200).send({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // console.log(oldRefreshToken);
    //verify refresh token
    const decodedToken = jwt.verify(oldRefreshToken, refreshTokenSecret);
    // console.log(decodedToken.user);
    if (!decodedToken) {
      throw createError(401, "Invalid refresh token. Please Login again");
    }

    // if token validation success generate new access token
    const accessToken = await createJWT(
      { user: decodedToken.user },
      accessTokenSecret,
      "1m"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 1000, // 1 minute in milliseconds
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // Update req.user with the new decoded user information
    req.user = decodedToken.user;
    //success response
    res.status(200).send({
      success: true,
      message: "New access token generate successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { handleLoginUser, handleLogoutUser, handleRefreshToken };
