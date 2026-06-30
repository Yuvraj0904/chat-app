import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPage from "./ChatPage";
import FriendsPage from "./FriendsPage";
import PrivateChatPage from "./PrivateChatPage";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        {activeTab === "global" && <ChatPage />}

        {activeTab === "friends" && (
          <FriendsPage
            setSelectedFriend={setSelectedFriend}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "requests" && <FriendsPage onlyRequests={true} />}

        {activeTab === "private" && selectedFriend && (
          <PrivateChatPage friendId={selectedFriend} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
