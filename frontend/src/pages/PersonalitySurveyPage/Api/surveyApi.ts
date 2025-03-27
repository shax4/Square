import axiosInstance from "./axios"

// Types
interface SurveyResponse {
  questionId: number
  selectedOption: number | null
}

interface SurveySubmitResponse {
  success: boolean
  message: string
  surveyId?: string
}

// API functions
export const submitSurveyResponses = async (
  responses: Record<number, number | null>,
): Promise<SurveySubmitResponse> => {
  try {
    // Transform the responses object into an array format if needed
    const formattedResponses: SurveyResponse[] = Object.entries(responses).map(([questionId, selectedOption]) => ({
      questionId: Number.parseInt(questionId),
      selectedOption,
    }))

    // Make the API call
    const response = await axiosInstance.post<SurveySubmitResponse>("/surveys/submit", {
      responses: formattedResponses,
    })

    return response.data
  } catch (error) {
    console.error("Failed to submit survey:", error)
    throw error
  }
}

// You can add more survey-related API functions here
export const getSurveyQuestions = async () => {
  try {
    const response = await axiosInstance.get("/surveys/questions")
    return response.data
  } catch (error) {
    console.error("Failed to fetch survey questions:", error)
    throw error
  }
}

