import Chat from "../models/Message.js";
import PrivateMessage from "../models/PrivateMessage.js";

const users = {}; // socket.id -> username (Global Chat)
const onlineUsers = {}; // userId -> socketId (Private Chat)

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // GLOBAL CHAT 

    socket.on("join_chat", (username) => {
      users[socket.id] = username;

      io.emit("online_users", Object.values(users));
      io.emit("user_joined", `${username} joined the chat`);
    });

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
        res.json({
          success:false,
          message:error.message
        })
      }
    });

    // PRIVATE CHAT 

    socket.on("register_user", ({ userId }) => {
      onlineUsers[userId] = socket.id;

      // Send online user IDs
      io.emit("private_online_users", Object.keys(onlineUsers));
    });

    socket.on("send_friend_notification", (data) => {
      const { receiverId, senderName } = data;

      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new_friend_request", senderName);
      }
    });

    socket.on("private_message", async (data) => {
      try {
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
      } catch (error) {
     res.json({
       success: false,
       message: error.message,
     });
      }
    });

    // TYPING 

    socket.on("typing", (username) => {
      socket.broadcast.emit("user_typing", username);
    });

    socket.on("stop_typing", () => {
      socket.broadcast.emit("user_stop_typing");
    });

    // DISCONNECT

    socket.on("disconnect", () => {
      // Global chat
      const username = users[socket.id];

      delete users[socket.id];

      io.emit("online_users", Object.values(users));

      if (username) {
        io.emit("user_left", `${username} left the chat`);
      }

      // Private chat
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }

      io.emit("private_online_users", Object.keys(onlineUsers));
    });
  });
};

export default socketHandler;
