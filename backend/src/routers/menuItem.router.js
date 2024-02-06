import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateMenuItem,
  handleDeleteMenuItems,
  handleEditMenuItem,
  handleGetMenuItems,
} from "../controllers/menuItems.controller.js";

const MenuItemRouter = express.Router();

MenuItemRouter.post("/menu-item/add", isLoggedIn, handleCreateMenuItem);
MenuItemRouter.get("/menu-items", handleGetMenuItems);
MenuItemRouter.patch("/menu-item/edit/:id", isLoggedIn, handleEditMenuItem);
MenuItemRouter.delete(
  "/menu-item/delete/:id",
  isLoggedIn,
  handleDeleteMenuItems
);

export default MenuItemRouter;
