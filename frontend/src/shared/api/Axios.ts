import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_URL;
// process.env.EXPO_PUBLIC_URL

export const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 5초 후 타임아웃.
    withCredentials: true,
    headers: {
        "Content-Type" : "application/json",
    },
});

// 필요한 경우, 아래 인터셉터 추가.

// // 요청 인터셉터 (요청 전 처리)
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // 예시: 인증 토큰 추가 시
//         const token = "your-auth-token";
//         if(token){
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // 응답 인터셉터 (응답 후 처리)
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.error("API Error:", error.response?.data || error.message);
//         return Promise.reject(error);
//     }
// )

export default axiosInstance;