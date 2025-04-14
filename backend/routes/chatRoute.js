import express from "express";
import {
  conversation,
  getAllMessage,
  message,
} from "../controller/message.controller.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();
router.route("/").post(isAuthenticated,message);
router.route("/conversation").get( conversation);
router.route("/getAllMessage").post(getAllMessage);

export default router;
