import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateStaff,
  handleDeleteStaff,
} from "../controllers/staff.controller.js";

const StaffRouter = express.Router();

StaffRouter.post("/staff/add-staff", handleCreateStaff);
StaffRouter.delete("/staff/delete/:id", isLoggedIn, handleDeleteStaff);

export default StaffRouter;
