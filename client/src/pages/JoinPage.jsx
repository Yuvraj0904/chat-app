import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";

const JoinPage = () => {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleJoin = () => {
    if (!username.trim()) return;

    socket.emit("join_chat", username);

    navigate("/chat", {
      state: { username },
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={handleJoin}>Join Chat</button>
    </div>
  );
};

export default JoinPage;
