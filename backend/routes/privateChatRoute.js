import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  sendPrivateMessage,
  getPrivateMessages,
} from "../controllers/privateChatController.js";

const privateChatRouter = express.Router();

privateChatRouter.post("/send", userAuth, sendPrivateMessage);

privateChatRouter.get("/:friendId", userAuth, getPrivateMessages);

export default privateChatRouter;
