import axiosInstance from "../../../shared/api/axiosInstance"
import {SurveyAnswer, SurveyQuestionsResponse} from "./surveyApi.types"
import { TypeResult } from "../../../shared/types/typeResult";


export const getSurveyQuestions = async () : Promise<SurveyQuestionsResponse> => {
  try{
    const response = await axiosInstance.get("/api/type");

    return response.data;
  }catch(error){
    console.error("성향 테스트 질문 받아오기 실패:", error);
    throw error;
  }
}

export const submitSurveyAnswers = async (answers: SurveyAnswer[]): Promise<TypeResult> => {
  try{
    const response = await axiosInstance.post("/api/type", {
      answers: answers
    });

    return response.data;
  }catch(error){
    console.log("성향 테스트 응답 제출 실패", error);
    throw error;
  }
}