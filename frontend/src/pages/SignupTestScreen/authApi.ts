import axiosInstance from "../../shared/api/axiosInstance";

export interface SignupPayload {
    nickname: string;
    fileName: string;
    region: string;
    gender: string;
    yearOfBirth: number;
    religion: string;
}

export interface SignupResponse {
    nickname: string;
    userType: string | null;
    state: string;
}

export const signup = async (data: SignupPayload) => {
    try {
        const response = await axiosInstance.post<SignupResponse>("/api/users", data);
        
        return {
            data: response.data,      // 응답 데이터
            headers: response.headers // 응답 헤더 (accessToken 확인용)
        };
    } catch (error) {
        console.error("회원가입 요청 실패:", error);
        throw error;
    }
};
