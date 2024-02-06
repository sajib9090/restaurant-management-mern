import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { handleCreateStaff } from "../controllers/staff.controller.js";

const StaffRouter = express.Router();


StaffRouter.post("/table/add-table", isLoggedIn, handleCreateStaff);


export default StaffRouter;
