import Chat from "../models/Message.js";
import PrivateMessage from "../models/PrivateMessage.js";
const users = {}; // global chat username mapping
const onlineUsers = {}; // userId -> socketId mapping
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("send_message", async (message) => {
      try {
        const username = users[socket.id];
        const chat = new Chat({
          username,
          message,
        });
        await chat.save();
        io.emit("receive_message", {
          username,
          message,
          time: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        console.log(error.message);
      }
    });
    socket.on("join_chat", (username) => {
      users[socket.id] = username;
      io.emit("online_users", Object.values(users));
      io.emit("user_joined", `${username} joined the chat`);
    });
    socket.on("register_user", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log("Online Users:", onlineUsers);
    });
    socket.on("private_message", async (data) => {
      const { senderId, receiverId, message } = data;

      await PrivateMessage.create({
        sender: senderId,
        receiver: receiverId,
        message,
      });

      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_private_message", {
          senderId,
          receiverId,
          message,
        });
      }
    });
    socket.on("typing", (username) => {
      console.log(username, "is typing");
      socket.broadcast.emit("user_typing", username);
    });
    socket.on("stop_typing", () => {
      socket.broadcast.emit("user_stop_typing");
    });
    socket.on("disconnect", () => {
      const username = users[socket.id];
      delete users[socket.id];
      // remove from private chat online users
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      io.emit("online_users", Object.values(users));
      if (username) {
        io.emit("user_left", `${username} left the chat`);
      }
    });
  });
};
export default socketHandler;
