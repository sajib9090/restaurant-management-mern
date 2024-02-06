import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateStaff,
  handleDeleteStaff,
  handleGetStaffs,
} from "../controllers/staff.controller.js";

const StaffRouter = express.Router();

StaffRouter.post("/staff/add-staff", handleCreateStaff);
StaffRouter.get("/staffs", handleGetStaffs);
StaffRouter.delete("/staff/delete/:id", isLoggedIn, handleDeleteStaff);

export default StaffRouter;
