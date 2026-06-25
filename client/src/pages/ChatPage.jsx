import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";

import api from "../services/api";
import { socket } from "../services/socket";

const ChatPage = () => {
  const messagesEndRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Get username from JoinPage
  const username = location.state?.username;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Redirect if username not found
  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    socket.emit("join_chat", username);
  }, [username, navigate]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send Message
  const handleMessages = () => {
    if (!message.trim()) return;

    socket.emit("send_message", message);
    setMessage("");
  };

  // Receive Messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // User Joined
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

  // User Left
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

  // Fetch Old Messages
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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-150 flex flex-col">
        <ChatHeader username={username} />

        <MessageList
          messages={messages}
          username={username}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          message={message}
          setMessage={setMessage}
          handleMessages={handleMessages}
        />
      </div>
    </div>
  );
};

export default ChatPage;
