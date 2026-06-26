import Chat from "../models/Message.js";
const users = {};
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
      io.emit("online_users", Object.values(users));
      io.emit("user_left", `${username} left the chat`);
      delete users[socket.id];
    });
  });
};
export default socketHandler;
