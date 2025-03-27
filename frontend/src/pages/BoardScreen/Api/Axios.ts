import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://j12a307.p.ssafy.io', // API 기본 URL (명세서에 따라 수정)
  timeout: 10000, // 요청 타임아웃 시간 (10초)
});

instance.interceptors.request.use(
  async (config) => {
    // 토큰 추가 (예: 인증 토큰)
    const token = await getAuthToken(); // 토큰 가져오는 함수 (별도 구현 필요)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 인증 토큰 가져오는 함수 (예시용, 실제 구현 필요)
async function getAuthToken(): Promise<string | null> {
  // 로컬 스토리지 또는 상태 관리에서 토큰 가져오기
  return null; // 예시로 null 반환
}

export default instance;
