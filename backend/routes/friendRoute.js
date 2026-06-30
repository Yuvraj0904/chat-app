import express from "express";
import userAuth from "../middleware/userAuth.js";

import {
  sendFriendRequest,
  acceptFriendRequest,
  allFriendRequest,
  allFriends,
  rejectFriendRequest,
  removeFriend,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/send-request/:id", userAuth, sendFriendRequest);
router.post("/accept-request/:id", userAuth, acceptFriendRequest);
router.post("/reject-request/:id", userAuth, rejectFriendRequest);
router.get("/requests", userAuth, allFriendRequest);
router.get("/my-friends", userAuth, allFriends);
router.post("/remove-friend/:id", userAuth, removeFriend);

export default router;
