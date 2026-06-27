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
    <div className="bg-blue-500 text-white p-4 rounded-t-xl flex justify-between items-center">
      <h1 className="text-2xl font-bold">Welcome, {username}</h1>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Home
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
