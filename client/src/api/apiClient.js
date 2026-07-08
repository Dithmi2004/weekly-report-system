import axios from "axios";
import { clearAuthStorage } from "../utils/tokenStorage";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicAuthPage = ["/login", "/register"].includes(
      window.location.pathname
    );

    if (error.response?.status === 401 && !isPublicAuthPage) {
      clearAuthStorage();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
