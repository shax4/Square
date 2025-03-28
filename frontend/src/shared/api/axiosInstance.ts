import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_URL;
// process.env.EXPO_PUBLIC_URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10초 후 타임아웃.
    withCredentials: true,
    headers: {
        "Content-Type" : "application/json",
    },
});

export default axiosInstance;