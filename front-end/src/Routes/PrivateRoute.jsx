/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, apiLoading } = useContext(AuthContext);
  const location = useLocation();

  if (apiLoading) {
    return <div>loading...</div>;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
