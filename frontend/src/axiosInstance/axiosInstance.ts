import axios from "axios";
import useAuth from "@/store/useAuth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      if (error.response?.status === 401) {
        useAuth.getState().setLogout();
      }
    } catch (e) {
      //pass
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
