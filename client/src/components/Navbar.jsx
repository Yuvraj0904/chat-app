import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  // Send Verification OTP
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);

        toast.success("Logged out successfully");

        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-600 cursor-pointer"
      >
        Real-Time Chat
      </h1>

      {/* If User Logged In */}
      {userData ? (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold cursor-pointer group">
          {userData?.name?.[0]?.toUpperCase()}

          {/* Dropdown */}
          <div className="absolute hidden group-hover:block top-10 right-0 z-10">
            <ul className="bg-white shadow-lg rounded-md text-black min-w-42.5 py-2">
              <li
                onClick={() => navigate("/chat")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Chat
              </li>

              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // If User Not Logged In
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
