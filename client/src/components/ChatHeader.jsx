const ChatHeader = ({ username }) => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-t-xl">
      <h1 className="text-2xl font-bold">Welcome, {username}</h1>
    </div>
  );
};

export default ChatHeader;
