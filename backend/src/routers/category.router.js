import express from "express";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetCategories,
} from "../controllers/category.controller.js";
const categoryRouter = express.Router();

//user router
categoryRouter.get("/categories", handleGetCategories);

//only admin and chairman can create user
categoryRouter.post(
  "/category/add-category",
  isLoggedIn,
  isAdminOrChairman,
  handleCreateCategory
);
categoryRouter.delete(
  "/category/:id",
  isLoggedIn,
  isAdminOrChairman,
  handleDeleteCategory
);

export default categoryRouter;
