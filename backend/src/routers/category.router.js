import express from "express";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetCategories,
} from "../controllers/category.controller.js";
const categoryRouter = express.Router();

categoryRouter.get("/categories", handleGetCategories);

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
