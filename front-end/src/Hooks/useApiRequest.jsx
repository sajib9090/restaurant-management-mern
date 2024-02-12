/* eslint-disable no-unused-vars */
// api.js
import axios from "axios";

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshAccessToken();
        const retryResponse = await axios.request(error.config);
        return retryResponse;
      } catch (refreshError) {
        handleTokenRefreshError();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const refreshTokenResponse = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v2/user/auth/refresh-token`,
    { withCredentials: true }
  );
};

const handleTokenRefreshError = () => {
  localStorage.removeItem("user");
};

export default axiosInstance;
