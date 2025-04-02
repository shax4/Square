// 질문 항목ID와 그에 해당하는 유저 답변.
export interface SurveyAnswer {
  questionId: number;
  answer: number;
}


export interface SurveyQuestion {
  questionId: number;
  content: string;
}

export interface SurveyQuestionsResponse {
  questions: SurveyQuestion[];
}