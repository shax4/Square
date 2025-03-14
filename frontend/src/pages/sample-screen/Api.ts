import {axiosInstance} from "../../shared/index";

export const fetchHomeData = async () => {
    try {
        const response = await axiosInstance.get("/home");
        return response.data;
    }catch (error) {
        console.error("Failed to fetch home data", error);
        throw error;
    }
};