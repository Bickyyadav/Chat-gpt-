import express from "express";
import {
  conversation,
  getAllMessage,
  getAllProjectTitle,
  message,
} from "../controller/message.controller.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();
router.route("/").post(message);
router.route("/conversation").post(conversation);
router.route("/getAllMessage").post(getAllMessage);
router.route("/getAllProjectTitle").post(getAllProjectTitle);

export default router;
