import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import socketHandler from "./socket/socketHandler.js";
import route from "./routes/routeMessage.js";

const app = express();

app.use(cors());

connectDB();


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketHandler(io);
app.use('/chats',route)
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
