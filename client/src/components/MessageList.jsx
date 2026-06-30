const MessageList = ({ messages, username, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6  space-y-4">
      {messages.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-slate-400 text-lg">No messages yet 👋</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index}>
          {msg.system ? (
            <div className="flex justify-center">
              <span className="bg-slate-800 text-slate-400 text-sm px-4 py-2 rounded-full">
                {msg.message}
              </span>
            </div>
          ) : (
            <div
              className={`flex ${
                msg.username === username ? "justify-end" : "justify-start"
              }`}
            >
              {/* Other User Message */}
              {msg.username !== username ? (
                <div className="flex gap-3 items-end max-w-[75%]">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shrink-0">
                    {msg.username?.charAt(0).toUpperCase()}
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-slate-800 text-white px-5 py-3 rounded-3xl rounded-bl-md shadow-lg">
                    <p className="text-xs text-violet-400 mb-1 font-semibold">
                      {msg.username}
                    </p>

                    <p className="wrap-break-word">{msg.message}</p>

                    <p className="text-[10px] text-slate-400 text-right mt-2">
                      {msg.time ||
                        new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                  </div>
                </div>
              ) : (
                /* Current User Message */
                <div className="max-w-[75%]">
                  <div className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-3 rounded-3xl rounded-br-md shadow-xl">
                    <p className="break-word">{msg.message}</p>

                    <p className="text-[10px] text-violet-100 text-right mt-2">
                      {msg.time ||
                        new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;
