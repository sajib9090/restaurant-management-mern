import createError from "http-errors";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../../secret.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw createError(401, "Access token not found. Please Login First");
    }

    const decoded = jwt.verify(token, accessTokenSecret);
    // console.log(decoded);
    // send user information
    req.user = decoded.user;
    if (!decoded) {
      throw createError(
        403,
        "Failed to authenticate token. Please login again"
      );
    }

    next();
  } catch (error) {
    return next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      throw createError(400, "User already logged in");
    }

    next();
  } catch (error) {
    return next(error);
  }
};
const isAdminOrChairman = async (req, res, next) => {
  try {
    // extract admin value
    const authorityUser =
      (req.user && req.user.isAdmin) || (req.user && req.user.isChairman);
    if (!authorityUser) {
      throw createError(403, "Forbidden access. Only authority can access");
    }

    next();
  } catch (error) {
    return next(error);
  }
};

export { isLoggedIn, isLoggedOut, isAdminOrChairman };
