import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, setUserData, userData } =
    useContext(AppContext);

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
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
    <div className="w-80 h-screen bg-[#8f9580] text-white flex flex-col border-r border-b-blue-950">
      {/* Profile */}

      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-r from-fuchsia-100 to-fuchsia-500 flex items-center justify-center text-3xl font-bold shadow-lg">
            {userData?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-bold">{userData?.name}</h2>

            <p className="text-olive-500 text-sm">{userData?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu */}

      <div className="flex-1 p-5 space-y-4">
        <button
          onClick={() => setActiveTab("global")}
          className={`w-full p-4 rounded-2xl transition-all duration-300 text-left ${
            activeTab === "global"
              ? "bg-linear-to-r from-mauve-300 to-mauve-500 shadow-xl"
              : "hover:bg-slate-800"
          }`}
        >
          🌍 Global Chat
        </button>

        <button
          onClick={() => setActiveTab("friends")}
          className={`w-full p-4 rounded-2xl transition-all duration-300 text-left ${
            activeTab === "friends"
              ? "bg-linear-to-r from-mauve-300 to-mauve-500 shadow-xl"
              : "hover:bg-slate-800"
          }`}
        >
          👥 Friends
        </button>
      </div>

      {/* Logout */}

      <div className="p-5">
        <button
          onClick={logout}
          className="w-full rounded-2xl bg-slate-800 hover:bg-slate-700 p-4 transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
