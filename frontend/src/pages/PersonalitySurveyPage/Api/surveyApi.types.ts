// 질문 항목ID와 그에 해당하는 유저 답변.
export interface SurveyAnswer {
    questionId: number;
    answer: number;
  }
  
  // 성향 테스트 완료시 받는 데이터.
  export interface SurveyResponse {
    nickname: string;
    userType: string;
    score1: number;
    score2: number;
    score3: number;
    score4: number;
  }
  
  export interface SurveyQuestion {
    questionId: number;
    content: string;
  }
  
  export interface SurveyQuestionsResponse {
    questions: SurveyQuestion[];
  }