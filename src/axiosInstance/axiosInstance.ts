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
    try {
      if (
        error.response?.status === 401 &&
        error.config.url !== "/users/logout"
      ) {
        //remove cookie and logout
        useAuth.getState().setLogout();
        await axiosInstance.delete("/users/logout");
        //redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (e) {
      console.log(e);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
