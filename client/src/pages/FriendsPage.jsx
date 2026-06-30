import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const FriendsPage = ({
  setSelectedFriend,
  setActiveTab,
  setUnreadMessages,
  unreadMessages,
  onlineUsers,
  onlyRequests = false,
}) => {
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
   <div className="min-h-screen p-8 bg-[#020617] text-white">
     <h1 className="text-4xl font-bold mb-8">
       {onlyRequests ? "Friend Requests" : "Friends"}
     </h1>

     <div
       className={`${onlyRequests ? "max-w-3xl" : "grid lg:grid-cols-2 gap-8"}`}
     >
       {/* Friend Requests */}
       {(onlyRequests || !onlyRequests) && (
         <div className="bg-[#111827] border border-slate-700 p-8 rounded-3xl shadow-2xl">
           <h2 className="text-2xl font-semibold mb-6">Friend Requests</h2>

           {requests.length === 0 ? (
             <p className="text-slate-400">No friend requests</p>
           ) : (
             requests.map((user) => (
               <div
                 key={user._id}
                 className="flex justify-between items-center border-b border-slate-700 py-5"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold text-white">
                     {user.name.charAt(0).toUpperCase()}
                   </div>

                   <div>
                     <p className="font-semibold text-lg">{user.name}</p>

                     <p className="text-slate-400 text-sm">{user.email}</p>
                   </div>
                 </div>

                 <div className="flex gap-3">
                   <button
                     onClick={() => handleAccept(user._id)}
                     className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                   >
                     Accept
                   </button>

                   <button
                     onClick={() => handleReject(user._id)}
                     className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
                   >
                     Reject
                   </button>
                 </div>
               </div>
             ))
           )}
         </div>
       )}

       {/* Friends */}
       {!onlyRequests && (
         <div className="bg-[#111827] border border-slate-700 p-8 rounded-3xl shadow-2xl">
           <h2 className="text-2xl font-semibold mb-6">My Friends</h2>

           {friends.length === 0 ? (
             <p className="text-slate-400">No friends yet</p>
           ) : (
             friends.map((friend) => (
               <div
                 key={friend._id}
                 className="flex justify-between items-center border-b border-slate-700 py-5"
               >
                 <div className="flex items-center gap-4">
                   {/* Avatar */}

                   <div className="relative">
                     <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold text-white">
                       {friend.name.charAt(0).toUpperCase()}
                     </div>

                     <span
                       className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#111827] ${
                         onlineUsers?.includes(friend._id)
                           ? "bg-green-500"
                           : "bg-gray-500"
                       }`}
                     ></span>
                   </div>

                   {/* Info */}

                   <div>
                     <div className="flex items-center gap-2">
                       <h3 className="font-semibold text-lg">{friend.name}</h3>

                       {unreadMessages?.[friend._id] > 0 && (
                         <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                           {unreadMessages[friend._id]}
                         </span>
                       )}
                     </div>

                     <p className="text-slate-400 text-sm">{friend.email}</p>

                     <p className="text-sm text-slate-500">
                       {onlineUsers?.includes(friend._id)
                         ? "Online"
                         : "Offline"}
                     </p>
                   </div>
                 </div>

                 <button
                   onClick={() => {
                     setSelectedFriend(friend);
                     setActiveTab("private");

                     setUnreadMessages((prev) => ({
                       ...prev,
                       [friend._id]: 0,
                     }));
                   }}
                   className="px-6 py-3 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:scale-105 transition"
                 >
                   Open Chat
                 </button>
               </div>
             ))
           )}
         </div>
       )}
     </div>
   </div>
 );
};
export default FriendsPage;
