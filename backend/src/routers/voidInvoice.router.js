import express from "express";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
import { handleCreateVoidInvoice } from "../controllers/voidInvoice.controller.js";

const VoidInvoiceRouter = express.Router();

VoidInvoiceRouter.post("/void-invoice/add", handleCreateVoidInvoice);

export default VoidInvoiceRouter;
