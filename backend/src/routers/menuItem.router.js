import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { handleCreateMenuItem } from "../controllers/menuItems.controller.js";

const MenuItemRouter = express.Router();

MenuItemRouter.post("/menu-item/add", isLoggedIn, handleCreateMenuItem);

export default MenuItemRouter;
