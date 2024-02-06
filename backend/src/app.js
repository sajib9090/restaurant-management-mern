import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { rateLimit } from "express-rate-limit";
import userRouter from "./routers/user.router.js";
import userAuthRouter from "./routers/authUser.router.js";
import categoryRouter from "./routers/category.router.js";
import TableRouter from "./routers/Table.router.js";
import MemberRouter from "./routers/member.router.js";
import MenuItemRouter from "./routers/menuItem.router.js";
import StaffRouter from "./routers/staff.router.js";
import ExpenseRouter from "./routers/expense.router.js";
import OrderLogRouter from "./routers/orderLog.router.js";
//

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  handler: (_, res) => {
    res
      .status(429)
      .json({ success: false, message: "Too many requests, try again later." });
  },
});

//middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v2", userRouter);
app.use("/api/v2", userAuthRouter);
app.use("/api/v2", categoryRouter);
app.use("/api/v2", TableRouter);
app.use("/api/v2", MemberRouter);
app.use("/api/v2", MenuItemRouter);
app.use("/api/v2", StaffRouter);
app.use("/api/v2", ExpenseRouter);
app.use("/api/v2", OrderLogRouter);

app.get("/", (req, res) => {
  res.status(200).send({ success: true, message: "Server is running" });
});

//client error handling
app.use((req, res, next) => {
  createError(404, "Route not found!");
  next();
});

//server error handling
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

export default app;
