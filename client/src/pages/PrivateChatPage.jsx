import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { socket } from "../services/socket";

const PrivateChatPage = ({ friend, onlineUsers }) => {
  const friendId = friend._id;
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
      res.json({
        success: false,
        message: error.message,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [friendId]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Receive live messages
  useEffect(() => {
    socket.on("receive_private_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_private_message");
  }, []);

  // Send Message
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
        createdAt: new Date(),
      },
    ]);

    setMessage("");
  };
const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  return (
    <div className="h-screen bg-[#020617] p-6">
      <div className="h-full bg-[#111827] rounded-3xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}

        <div className="bg-[#0F172A] p-5 border-b border-slate-700 flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold">
              {friend.name.charAt(0).toUpperCase()}
            </div>

            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0F172A] ${
                onlineUsers?.includes(friend._id)
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            ></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold">
                {friend.name.charAt(0).toUpperCase()}
              </div>

              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  onlineUsers?.includes(friend._id)
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></span>
            </div>

            <div>
              <h2 className="text-xl font-semibold">{friend.name}</h2>

              <p className="text-sm text-slate-300">
                {onlineUsers?.includes(friend._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto p-6 bg-[#020617] space-y-4">
          {messages.map((msg, index) => {
            const isMine =
              msg.sender?._id === userData?._id ||
              msg.sender === userData?._id ||
              msg.senderId === userData?._id;

            return (
              <div
                key={index}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                {!isMine && (
                  <div className="w-10 h-10 mr-3 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div
                  className={`max-w-[70%] px-5 py-3 rounded-3xl shadow-xl ${
                    isMine
                      ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                      : "bg-slate-800 text-white rounded-bl-md"
                  }`}
                >
                  <p className="wrap-break-word">{msg.message}</p>

                  <p className="text-[10px] mt-2 opacity-70 text-right">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}

        <div className="p-5 border-t border-slate-700 bg-[#111827]">
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 text-white px-6 py-4 rounded-2xl outline-none border border-slate-700 focus:border-violet-500"
            />

            <button
              onClick={handleSendMessage}
              className="px-8 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:scale-105 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChatPage;
