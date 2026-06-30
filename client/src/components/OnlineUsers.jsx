const OnlineUsers = ({ onlineUsers }) => {
  return (
    <div className="bg-[#5b7499] border-b border-slate-700 p-4">
      <h2 className="text-white font-semibold mb-3">
        Online Users ({onlineUsers.length})
      </h2>

      <div className="flex gap-3 overflow-x-auto">
        {onlineUsers.map((user, index) => (
          <div key={index} className="flex flex-col items-center min-w-fit">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                {user.charAt(0).toUpperCase()}
              </div>

              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1E293B]"></span>
            </div>

            <p className="text-slate-300 text-xs mt-2">{user}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;
