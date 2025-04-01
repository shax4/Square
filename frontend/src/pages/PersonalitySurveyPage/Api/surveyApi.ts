import axiosInstance from "../../../shared/api/axiosInstance"
import {SurveyAnswer, SurveyResponse, SurveyQuestionsResponse} from "./surveyApi.types"


export const getSurveyQuestions = async () : Promise<SurveyQuestionsResponse> => {
  try{
    const response = await axiosInstance.get("/api/type");

    return response.data;
  }catch(error){
    console.error("성향 테스트 질문 받아오기 실패:", error);
    throw error;
  }
}

export const submitSurveyAnswers = async (answers: SurveyAnswer[]): Promise<SurveyResponse> => {
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

// You can add more survey-related API functions here
// export const getSurveyQuestions = async () => {
//   try {
//     const response = await axiosInstance.get("/surveys/questions")
//     return response.data
//   } catch (error) {
//     console.error("Failed to fetch survey questions:", error)
//     throw error
//   }
// }


// API functions
// export const submitSurveyResponses = async (
//   responses: Record<number, number | null>,
// ): Promise<SurveySubmitResponse> => {
//   try {
//     // Transform the responses object into an array format if needed
//     const formattedResponses: SurveyResponse[] = Object.entries(responses).map(([questionId, selectedOption]) => ({
//       questionId: Number.parseInt(questionId),
//       selectedOption,
//     }))

//     // Make the API call
//     const response = await axiosInstance.post<SurveySubmitResponse>("/surveys/submit", {
//       responses: formattedResponses,
//     })

//     return response.data
//   } catch (error) {
//     console.error("Failed to submit survey:", error)
//     throw error
//   }
// }

// 예시 코드: 설문조사 응답 제출
// const exampleSubmit = async () => {
//   const exampleAnswers: SurveyAnswer[] = [
//     { questionId: 1, answer: 3 },
//     { questionId: 2, answer: 1 },
//     { questionId: 3, answer: 2 },
//     { questionId: 4, answer: 4 }
//   ];

//   try {
//     const result = await submitSurveyAnswers(exampleAnswers);
//     console.log("응답 결과:", result);
//   } catch (error) {
//     console.error("API 호출 중 오류 발생:", error);
//   }
// };

// // 예시 코드: 설문조사 질문 가져오기
// const exampleGetQuestions = async () => {
//   try {
//     const result = await getSurveyQuestions();
//     console.log("설문조사 질문:", result.questions);
//   } catch (error) {
//     console.error("설문조사 질문 가져오기 실패:", error);
//   }
// };