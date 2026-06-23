import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const messagesEndRef = useRef(null);

  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Join Chat
  const handleJoin = () => {
    if (!username.trim()) return;

    socket.emit("join_chat", username);
    setJoined(true);
  };

  // Send Message
  const handleMessages = () => {
    if (!message.trim()) return;

    socket.emit("send_message", message);
    setMessage("");
  };

  // Receive Messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // console.log(data);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      {!joined ? (
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            Real-Time Chat
          </h1>

          <input
            type="text"
            placeholder="Enter Username"
            className="w-full border p-3 rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            type="button"
            onClick={handleJoin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-150 flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-xl">
            <h1 className="text-2xl font-bold">Welcome, {username}</h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-500">No messages yet...</p>
            )}

            {messages.map((msg, index) => (
              <div key={index} className="mb-3">
                {msg.system ? (
                  <p className="text-center text-gray-500">{msg.message}</p>
                ) : (
                  <div
                    className={`flex ${
                      msg.username === username
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.username === username
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      <strong>{msg.username}</strong>

                      <p>{msg.message}</p>

                      <div className="text-xs mt-1 opacity-70">{msg.time}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border p-3 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMessages();
                }
              }}
            />

            <button
              type="button"
              onClick={handleMessages}
              className="bg-green-500 hover:bg-green-600 text-white px-6 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
