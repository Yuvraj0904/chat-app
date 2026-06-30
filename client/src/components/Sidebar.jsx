import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);

  const logout = async () => {
    try {
      await axios.post(
        backendUrl + "/api/auth/logout",
        {},
        { withCredentials: true },
      );

      setIsLoggedin(false);
      setUserData(null);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">Chat App</h1>

      <button
        onClick={() => setActiveTab("global")}
        className={`w-full text-left p-3 rounded mb-2 ${
          activeTab === "global" ? "bg-blue-500" : "hover:bg-slate-700"
        }`}
      >
        🌍 Global Chat
      </button>

      <button
        onClick={() => setActiveTab("friends")}
        className={`w-full text-left p-3 rounded mb-2 ${
          activeTab === "friends" ? "bg-blue-500" : "hover:bg-slate-700"
        }`}
      >
        👥 Friends
      </button>
     
      <button
        onClick={logout}
        className="w-full text-left p-3 rounded mt-10 bg-red-500 hover:bg-red-600"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
