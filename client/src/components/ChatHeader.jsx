import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../context/AppContext";

const ChatHeader = ({ username }) => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);

        toast.success("Logged out successfully");

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-[#111827] border-b border-slate-700 p-5 flex justify-between items-center">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-white">Global Chat</h1>

        <p className="text-slate-400 text-sm">
          Connect and chat with everyone in real time
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-white font-medium">{username}</p>

          <div className="flex items-center justify-end gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>

            <p className="text-slate-400 text-sm">Online</p>
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {username?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
