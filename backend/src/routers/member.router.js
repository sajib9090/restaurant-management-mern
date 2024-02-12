import express from "express";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";
import {
  handleCreateMember,
  handleDeleteMember,
  handleEditMember,
  handleGetMember,
  handleGetMembers,
} from "../controllers/member.controller.js";

const MemberRouter = express.Router();

MemberRouter.get("/members", handleGetMembers);
MemberRouter.get("/member/:mobile", handleGetMember);
MemberRouter.patch("/member/edit/:mobile", isLoggedIn, handleEditMember);
MemberRouter.post("/member/add-member", isLoggedIn, handleCreateMember);
MemberRouter.delete(
  "/member/delete/:id",
  isLoggedIn,
  isAdminOrChairman,
  handleDeleteMember
);

export default MemberRouter;
