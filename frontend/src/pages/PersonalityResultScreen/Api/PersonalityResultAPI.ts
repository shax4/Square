import axiosInstance from "../../../shared/api/axiosInstance"
import { TypeResult } from "../../../shared/types/typeResult";

export const getMyPersonalityResult = async () : Promise<TypeResult> => {
  try{
    const response = await axiosInstance.get("/api/type/my");

    return response.data;
  }catch(error){
    console.error("내 성향 테스트 결과 받아오기 실패:", error);
    throw error;
  }
}

export const getOthersPersonalityResult = async (nickname : string) : Promise<TypeResult> => {
  try{
    const response = await axiosInstance.get("/api/type/other", {params: { nickname }});

    return response.data;
  }catch(error){
    console.error("다른 사람 성향 테스트 결과 받아오기 실패:", error);
    throw error;
  }
}