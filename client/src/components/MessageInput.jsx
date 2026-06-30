import { socket } from "../services/socket";

const MessageInput = ({ message, setMessage, handleMessages, username }) => {
  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="
      flex-1
      bg-cyan-600
      text-white
      rounded-2xl
      px-6
      py-4
      outline-none
      "
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit("typing", username);
          setTimeout(() => {
            socket.emit("stop_typing");
          }, 1000);
        }}
      />

      <button
        className="
      px-8
      rounded-2xl
      bg-linear-to-r
      from-violet-600
      to-fuchsia-600
      text-white
      shadow-lg
      "
        onClick={handleMessages}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
