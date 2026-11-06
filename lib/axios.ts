import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
