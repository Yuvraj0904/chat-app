import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPage from "./ChatPage";
import FriendsPage from "./FriendsPage";
import PrivateChatPage from "./PrivateChatPage";
import { AppContext } from "../context/AppContext";
import { socket } from "../services/socket";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { userData } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("global");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [unreadMessages, setUnreadMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Register user for private chat online status
  useEffect(() => {
    if (userData?._id) {
      socket.emit("register_user", {
        userId: userData._id,
      });
    }
  }, [userData]);

  // Receive online users for private chat
  useEffect(() => {
    socket.on("private_online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("private_online_users");
    };
  }, []);

  // Unread messages notification
  useEffect(() => {
    socket.on("receive_private_message", (data) => {
      const senderId = data.senderId;

      if (activeTab !== "private" || selectedFriend !== senderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("receive_private_message");
    };
  }, [activeTab, selectedFriend]);

  // Friend request notification
  useEffect(() => {
    socket.on("new_friend_request", (senderName) => {
      toast.info(`${senderName} sent you a friend request`);
    });

    return () => {
      socket.off("new_friend_request");
    };
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        {activeTab === "global" && <ChatPage />}

        {activeTab === "friends" && (
          <FriendsPage
            setSelectedFriend={setSelectedFriend}
            setActiveTab={setActiveTab}
            unreadMessages={unreadMessages}
            setUnreadMessages={setUnreadMessages}
            onlineUsers={onlineUsers}
          />
        )}
        {activeTab === "private" && selectedFriend && (
          <PrivateChatPage friend={selectedFriend} onlineUsers={onlineUsers} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
