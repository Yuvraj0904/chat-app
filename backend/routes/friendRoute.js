import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  allFriendRequest,
  allFriends,
  rejectFriendRequest,
} from "../controllers/friendController.js";

const friendRouter = express.Router();

friendRouter.post("/send-request/:id", userAuth, sendFriendRequest);
friendRouter.post("/accept-request/:id", userAuth, acceptFriendRequest);
friendRouter.get("/requests", userAuth, allFriendRequest);
friendRouter.get("/my-friends", userAuth, allFriends);
friendRouter.get("/reject-request/:id", userAuth, rejectFriendRequest);

export default friendRouter;
