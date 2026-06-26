const OnlineUsers = ({ onlineUsers }) => {
  return (
    <div className="p-4 border-b">
      <h2 className="font-bold mb-2">Online Users ({onlineUsers.length})</h2>
      {onlineUsers.map((user, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>{user}</span>
        </div>
      ))}
    </div>
  );
};
export default OnlineUsers;
