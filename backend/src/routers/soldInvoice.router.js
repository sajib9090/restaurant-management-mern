import express from "express";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateInvoice,
  handleDeleteSoldInvoice,
} from "../controllers/soldInvoice.controller.js";

const SoldInvoiceRouter = express.Router();

SoldInvoiceRouter.post("/sold-invoice/add", handleCreateInvoice);
SoldInvoiceRouter.delete(
  "/sold-invoice/delete/:id",
  isLoggedIn,
  isAdminOrChairman,
  handleDeleteSoldInvoice
);

export default SoldInvoiceRouter;
