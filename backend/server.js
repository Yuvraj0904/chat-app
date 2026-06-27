import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import socketHandler from "./socket/socketHandler.js";
import cookieParser from "cookie-parser";
import route from "./routes/routeMessage.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
socketHandler(io);
app.use("/chats", route);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});