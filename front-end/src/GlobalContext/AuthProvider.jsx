/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import axiosInstance from "../Hooks/useApiRequest";
import { getApiRequest } from "../api/apiRequest";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_id"));

    if (userData) {
      getApiRequest(`/api/v2/user/${userData}`)
        .then((res) => {
          setUser(res.user);
        })
        .catch((err) => {
          setUser(null);
        })
        .finally(() => {
          setApiLoading(false);
        });
    }
    setApiLoading(false);
  }, []);

  const signInWithUsername = async (username, password) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v2/user/auth/login`,
      { username, password },
      { withCredentials: true }
    );
    localStorage.setItem(
      "user_id",
      JSON.stringify(response?.data?.userInfo?._id)
    );
    setUser(response.data.userInfo);
    setApiLoading(false);
    return response;
  };

  const logout = async () => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/api/v2/user/auth/logout`,
        null,
        { withCredentials: true }
      );

      if (response) {
        localStorage.removeItem("user_id");
        setUser(null);
        setApiLoading(false);
      }
    } catch (error) {
      setApiLoading(false);
    }
  };

  const authInfo = {
    signInWithUsername,
    user,
    setUser,
    logout,
    apiLoading,
    setApiLoading,
  };

  if (apiLoading) {
    return <div>Loading....</div>;
  }
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
