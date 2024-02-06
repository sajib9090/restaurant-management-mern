import createError from "http-errors";
import Table from "../models/table.model.js";
import findDataById from "../services/findDataById.js";

let tableCounter = 0;

const getNextTable = () => {
  tableCounter += 1;
  return `table-${tableCounter}`;
};

const handleCreateTable = async (req, res, next) => {
  try {
    const tableName = getNextTable();

    // Create a new table
    const newTable = new Table({
      name: tableName,
    });
    // Save the category to the database
    await newTable.save();
    // Response with the generated table name
    res.status(200).send({
      success: true,
      newTable,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetTables = async (req, res, next) => {
  try {
    const tables = await Table.find();

    res.status(200).send({
      success: true,
      message: "Tables retrieved successfully",
      tables,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteTable = async (req, res, next) => {
  try {
    const id = req.params.id;

    const options = {};

    const table = await findDataById(id, Table, options, next);

    if (table) {
      await Table.findByIdAndDelete(id);

      res.status(200).send({
        success: true,
        message: `Table deleted successfully.`,
      });
    }
  } catch (error) {
    next(error);
  }
};
const handleEditTable = async (req, res, next) => {
  try {
    const id = req.params.id;

    const options = {};

    const table = await findDataById(id, Table, options, next);

    if (table) {
      const { name } = req.body;

      const trimmedName = name.replace(/\s+/g, " ").trim();

      const tableSlug = trimmedName.replace(/\s+/g, "-");

      if (/^\d/.test(tableSlug)) {
        throw createError(400, "Invalid name format.");
      }

      const existingTableName = await Table.findOne({ name: tableSlug });

      if (existingTableName) {
        throw createError(400, "Already exist this table name.");
      }

      // Update the table name
      table.name = tableSlug;
      await table.save();

      res.status(200).send({
        success: true,
        message: "Table name updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  handleCreateTable,
  handleGetTables,
  handleDeleteTable,
  handleEditTable,
};
