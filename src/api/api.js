// api/api.js
import axios from "axios";
import { getApiBaseUrl } from "../config/apiConfig";

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// Add JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
