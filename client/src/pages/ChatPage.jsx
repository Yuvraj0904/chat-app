import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";
import OnlineUsers from "../components/OnlineUsers";
import AllUsers from "../components/AllUsers";
import api from "../services/api";
import { socket } from "../services/socket";

import { AppContext } from "../context/AppContext";

const ChatPage = () => {
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const { userData, isLoggedin } = useContext(AppContext);

  const username = userData?.name;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedin) {
      navigate("/login");
      return;
    }

    if (username) {
      socket.emit("join_chat", username);
    }
  }, [isLoggedin, username, navigate]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Fetch old messages
  const fetchOldMessages = async () => {
    try {
      const response = await api.get("/chats/messages");

      setMessages(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOldMessages();
  }, []);

  // Send Message
  const handleMessages = () => {
    if (!message.trim()) return;

    socket.emit("send_message", message);

    setMessage("");
  };

  // Receive messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // User joined
  useEffect(() => {
    socket.on("user_joined", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          message: msg,
        },
      ]);
    });

    return () => socket.off("user_joined");
  }, []);

  // User left
  useEffect(() => {
    socket.on("user_left", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          system: true,
          message: msg,
        },
      ]);
    });

    return () => socket.off("user_left");
  }, []);

  // Online users
  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online_users");
  }, []);

  // Typing indicator
  useEffect(() => {
    socket.on("user_typing", (username) => {
      setTypingUser(username);
    });

    socket.on("user_stop_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);
  const fetchAllUsers = async () => {
    try {
    const response = await api.get("/api/user/all-users", {
      withCredentials: true,
    });

      if (response.data.success) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);
  if (!isLoggedin) return null;

  return (
    <div className="h-full bg-indigo-200 p-6">
      <div className="bg-cyan-900 rounded-3xl h-full flex flex-col border bg-blend-color-burn shadow-2xl overflow-hidden">
        {/* Header */}
        <ChatHeader username={username} />

        {/* Online Users */}
        <OnlineUsers onlineUsers={onlineUsers} />

        <AllUsers
          users={allUsers}
          backendUrl={import.meta.env.VITE_BACKEND_URL}
        />

        {/* Messages */}
        <MessageList
          messages={messages}
          username={username}
          messagesEndRef={messagesEndRef}
        />

        {/* Typing Indicator */}
        {typingUser && (
          <p className="px-4 text-sm text-blue-900 italic">
            {typingUser} is typing...
          </p>
        )}

        {/* Message Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleMessages={handleMessages}
          username={username}
        />
      </div>
    </div>
  );
};

export default ChatPage;
