import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);
router.get("/all-users",userAuth,getAllUsers);
export default router;
