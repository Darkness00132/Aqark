import axios from "axios";
import useAuth from "@/store/useAuth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().setLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
