const MessageInput = ({ message, setMessage, handleMessages }) => {
  return (
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
        onClick={handleMessages}
        className="bg-green-500 hover:bg-green-600 text-white px-6 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
