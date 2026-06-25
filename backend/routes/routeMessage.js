import express from "express";
import { getMessages } from "../controllers/messageController.js";
const route = express.Router()
route.get('/messages',getMessages)

export default route;