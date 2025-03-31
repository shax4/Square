import axios from "axios";
import {useAuthStore} from "../stores/auth"

const API_URL = "https://j12a307.p.ssafy.io";
// process.env.EXPO_PUBLIC_URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10초 후 타임아웃.
    withCredentials: true,
    headers: {
        "Content-Type" : "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const {user} = useAuthStore.getState();
        const accessToken = user?.accessToken;

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const {user, updateAccessToken, logOut} = useAuthStore.getState();
        const refreshToken = user?.refreshToken;
        const accessToken = user?.accessToken;

        const isTokenExpired = error.response?.data?.code === 3002;
        /*
            토큰 만료 시 받게되는 response.
            {
                "code": 3002,
                "message": "토큰 검증에 실패했습니다."
            }
        */

        if(isTokenExpired){
            originalRequest._retry = true;

            if(refreshToken){
                try{
                    const response = await axios.post(`${API_URL}/api/auth/reissue`, null, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    const authHeader = response.headers["authorization"]; // "Bearer {newAccessToken}"

                    if(!authHeader || !authHeader.startsWith("Bearer ")){
                        throw new Error("🚨 Authorization 헤더 없음!");
                    }

                    const newAccessToken = authHeader.split(" ")[1]; // Bearer 이후 정보 가져옴.
                    // AsyncStorage에 저장.

                    console.log("새로 발급된 토큰 : ", newAccessToken)
                    updateAccessToken(newAccessToken)
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }catch(error : any){
                    // 로그아웃.
                    console.error("토큰 재발급 에러 : ", error);
                    console.error(error.response.data);
                    logOut();
                }
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;