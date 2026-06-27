import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch Logged In User
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");

      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Check Authentication
const getAuthState = async () => {
  setLoading(true);

  try {
    const { data } = await axios.get(backendUrl + "/api/auth/is-auth");

    if (data.success) {
      setIsLoggedin(true);
      await getUserData();
    }
  } catch (error) {
    setIsLoggedin(false);
    setUserData(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
