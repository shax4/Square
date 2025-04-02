import axiosInstance from "../../../shared/api/axiosInstance"
import { TypeResult } from "../../../shared/types/typeResult";

export const getPersonalityResult = async (nickname : string) : Promise<TypeResult> => {
  try{
    const response = await axiosInstance.get(`/api/type/${nickname}`);

    return response.data;
  }catch(error){
    console.error("성향 테스트 결과 받아오기 실패:", error);
    throw error;
  }
}