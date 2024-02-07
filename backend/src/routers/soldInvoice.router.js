import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { handleCreateInvoice } from "../controllers/soldInvoice.controller.js";

const SoldInvoiceRouter = express.Router();

SoldInvoiceRouter.post("/sold-invoice/add", handleCreateInvoice);

export default SoldInvoiceRouter;
