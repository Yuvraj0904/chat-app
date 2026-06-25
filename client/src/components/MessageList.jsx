const MessageList = ({ messages, username, messagesEndRef }) => {
  return (
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
                msg.username === username ? "justify-end" : "justify-start"
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

                <div className="text-xs mt-1 opacity-70">
                  {msg.time || new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;
