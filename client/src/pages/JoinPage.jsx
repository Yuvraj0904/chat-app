import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
const JoinPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleJoin = () => {
    if (!username.trim()) return;
    navigate("/chat", {
      state: { username },
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-blue-100 to-purple-100  items-center justify-center  p-4 gap-4">
      <input
        className="border-2 rounded-2xl"
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="border-0.5 p-2 font-bold rounded-2xl text-white bg-blue-700"
        onClick={handleJoin}
      >
        Join Chat
      </button>
    </div>
  );
};

export default JoinPage;
