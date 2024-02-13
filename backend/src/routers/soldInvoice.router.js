import express from "express";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateInvoice,
  handleDeleteSoldInvoice,
  handleGetAllSoldInvoices,
  handleGetInvoicesByDate,
  handleGetSingleSoldInvoiceByFrId,
  handleGetSingleSoldInvoiceById,
} from "../controllers/soldInvoice.controller.js";

const SoldInvoiceRouter = express.Router();

SoldInvoiceRouter.post("/sold-invoice/add", handleCreateInvoice);
SoldInvoiceRouter.get("/sold-invoices", handleGetAllSoldInvoices);
SoldInvoiceRouter.get("/sold-invoices/date/:date", handleGetInvoicesByDate);
SoldInvoiceRouter.get(
  "/sold-invoice/fr_id/:fr_id",
  handleGetSingleSoldInvoiceByFrId
);
SoldInvoiceRouter.get("/sold-invoice/id/:id", handleGetSingleSoldInvoiceById);
SoldInvoiceRouter.delete(
  "/sold-invoice/delete/:id",
  isLoggedIn,
  isAdminOrChairman,
  handleDeleteSoldInvoice
);

export default SoldInvoiceRouter;
