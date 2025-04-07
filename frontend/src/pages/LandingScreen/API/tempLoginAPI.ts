import axiosInstance from "../../../shared/api/axiosInstance"
import { userDetails } from "../../../shared/types/user";

export const loginTemp = async () : Promise<userDetails> => {
    try{
        const response = await axiosInstance.get("/api/auth/test1");

        return response.data;
    }catch(error : any){
        console.error("임시 로그인 실패 :", error);
        throw error;
    }
}