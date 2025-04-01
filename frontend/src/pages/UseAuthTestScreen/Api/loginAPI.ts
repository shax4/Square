import axiosInstance from "../../../shared/api/axiosInstance"
import { userDetails, UserInfo } from "../../../shared/types/user";

export const loginTemp = async () : Promise<userDetails> => {
    try{
        const response = await axiosInstance.get("/api/auth/test1");

        return response.data;
    }catch(error : any){
        console.error("임시 로그인 실패 :", error);
        throw error;
    }
}

export const getProfileInfos = async () : Promise<UserInfo> => {
    try{
        const response = await axiosInstance.get("/api/users");

        return response.data;
    }catch(error){
        console.error("프로필 정보 불러오기 실패 :", error);
        throw error;
    }
}