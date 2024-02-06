import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { handleCreateOrderLog } from "../controllers/orderLog.controller.js";

const OrderLogRouter = express.Router();

OrderLogRouter.post("/order-log/add", handleCreateOrderLog);
OrderLogRouter.delete("/order-log/delete/:table", handleCreateOrderLog);

export default OrderLogRouter;
