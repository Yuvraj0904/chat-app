import axios from "axios";
import { toast } from "react-toastify";
import { socket } from "../services/socket";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
const AllUsers = ({ users, backendUrl }) => {
  const { userData } = useContext(AppContext);

  const sendFriendRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/friends/send-request/${userId}`,
        {},
        { withCredentials: true },
      );

    if (data.success) {
      toast.success(data.message);

      socket.emit("send_friend_notification", {
        receiverId: userId,
        senderName: userData.name,
      });
    } else {
      toast.error(data.message);
    }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="border-b p-4">
      <h2 className="font-bold mb-2">All Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center py-2"
          >
            <span>{user.name}</span>

            <button
              onClick={() => sendFriendRequest(user._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Friend
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllUsers;
