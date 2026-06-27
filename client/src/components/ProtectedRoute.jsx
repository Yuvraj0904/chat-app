import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedin, loading } = useContext(AppContext);

  if (loading) {
    return <div>Loading...</div>;
  }
return isLoggedin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
