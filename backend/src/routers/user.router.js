import express from "express";
import {
  handleDeleteUser,
  handleEditUserRole,
  handleGetUser,
  handleGetUsers,
  handleProcessRegister,
} from "../controllers/user.controller.js";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
const userRouter = express.Router();

//user router
userRouter.get("/users", isLoggedIn, isAdminOrChairman, handleGetUsers);
userRouter.get("/user/:id", isLoggedIn, handleGetUser);
userRouter.delete("/user/:id", isLoggedIn, isAdminOrChairman, handleDeleteUser);
userRouter.patch(
  "/user/edit/:id",
  isLoggedIn,
  isAdminOrChairman,
  handleEditUserRole
);

//only admin and chairman can create user
userRouter.post(
  "/user/register-user",
  isLoggedIn,
  isAdminOrChairman,
  handleProcessRegister
);

export default userRouter;
