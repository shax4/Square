import axiosInstance from "./axiosInstance";

const getToken = () => {
    return "my-token";
}

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);