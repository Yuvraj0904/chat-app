import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const FriendsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchFriendRequests = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/friends/requests`, {
        withCredentials: true,
      });

      if (data.success) {
        setRequests(data.friendRequests);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/friends/my-friends`, {
        withCredentials: true,
      });

      if (data.success) {
        setFriends(data.friends);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleAccept = async (userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/friends/accept-request/${userId}`,
        {},
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);

        // Refresh the lists
        fetchFriendRequests();
        fetchFriends();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleReject = async (userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/friends/reject-request/${userId}`,
        {},
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
      }
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Friend Requests */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>

          {requests.length === 0 ? (
            <p>No friend requests</p>
          ) : (
            requests.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(user._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Friends */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">My Friends</h2>

          {friends.length === 0 ? (
            <p>No friends yet</p>
          ) : (
            friends.map((friend) => (
              <div key={friend._id} className="border-b py-3">
                <p className="font-medium">{friend.name}</p>

                <p className="text-sm text-gray-500">{friend.email}</p>
                <button
                  onClick={() => navigate(`/private-chat/${friend._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default FriendsPage;
