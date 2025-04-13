import express from "express";
import { conversation, getAllMessage, message } from "../controller/message.js";

const router = express.Router();
router.route("/").post(message);
router.route("/conversation").get(conversation)
router.route("/getAllMessage").get(getAllMessage);

export default router;
