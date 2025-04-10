import { axiosInstance } from "../../../shared";
import { UserInfo } from "../../../shared/types/user";

export const getProfileInfos = async () : Promise<UserInfo> => {
    try{
        const response = await axiosInstance.get("/api/users");

        return response.data;
    }catch(error){
        console.error("프로필 정보 불러오기 실패 :", error);
        throw error;
    }
}
