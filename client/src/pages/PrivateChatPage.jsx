import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { socket } from "../services/socket";
const PrivateChatPage = ({ friendId }) => {
  const { backendUrl, userData } = useContext(AppContext);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Register user socket
  useEffect(() => {
    if (userData?._id) {
      socket.emit("register_user", userData._id);
    }
  }, [userData]);

  // Fetch old messages
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/private-chat/${friendId}`,
        { withCredentials: true },
      );

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [friendId]);

  // Receive live messages
  useEffect(() => {
    socket.on("receive_private_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_private_message");
  }, []);

  // Send message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    socket.emit("private_message", {
      senderId: userData._id,
      receiverId: friendId,
      message,
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: userData._id,
        message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Private Chat</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sender?._id === userData?._id ||
                msg.sender === userData?._id ||
                msg.senderId === userData?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Type message..."
          />

          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-6 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChatPage;
