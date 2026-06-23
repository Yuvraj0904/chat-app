import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("send_message", (message) => {
    const username = users[socket.id];
    io.emit("receive_message", {
      username,
      message,
      time: new Date().toLocaleTimeString(),
    });
  });
  socket.on("join_chat", (username) => {
    users[socket.id] = username;
    io.emit("user_joined", `${username} joined the chat`);
    console.log(users);
  });
  socket.on("disconnect", () => {
    const username = users[socket.id];
    io.emit("user_left", `${username} left the chat`);
    delete users[socket.id];
    console.log("User disconnected:", socket.id);
  });
});
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
