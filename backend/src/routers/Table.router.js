import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateTable,
  handleDeleteTable,
  handleEditTable,
  handleGetTables,
} from "../controllers/table.controller.js";
const TableRouter = express.Router();

TableRouter.get("/tables", handleGetTables);
TableRouter.post("/table/add-table", isLoggedIn, handleCreateTable);
TableRouter.patch("/table/edit/:id", isLoggedIn, handleEditTable);
TableRouter.delete("/table/delete/:id", isLoggedIn, handleDeleteTable);

export default TableRouter;
