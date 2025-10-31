// src/api.js
import axios from "axios";

// ✅ Create an Axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // your Django backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Add a request interceptor to include JWT token (if available)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access"); // token from login
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ (Optional) Handle token refresh when expired
// You can add a response interceptor later if needed

export default api;
