import axiosInstance from "../Hooks/useApiRequest";

const baseUrl = import.meta.env.VITE_API_URL;

const postApiRequest = async (url, data) => {
  try {
    const response = await axiosInstance.post(baseUrl + url, data, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const patchApiRequest = async (url, data) => {
  try {
    const response = await axiosInstance.patch(baseUrl + url, data, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const getApiRequest = async (url) => {
  try {
    const response = await axiosInstance.get(baseUrl + url, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

const deleteApiRequest = async (url) => {
  try {
    const response = await axiosInstance.delete(baseUrl + url, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export { postApiRequest, getApiRequest, patchApiRequest, deleteApiRequest };
