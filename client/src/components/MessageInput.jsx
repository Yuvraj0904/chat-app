import { socket } from "../services/socket";

const MessageInput = ({ message, setMessage, handleMessages, username }) => {
  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border p-3 rounded"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit("typing", username);
          setTimeout(() => {
            socket.emit("stop_typing");
          }, 1000);
        }}
      />

      <button onClick={handleMessages}>Send</button>
    </div>
  );
};

export default MessageInput;
