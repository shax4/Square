import BottomNav from './navigation/BottomNav';
import { useEffect } from 'react';
import { setupAuthInterceptor } from '../shared/api/authInterceptor';

export default function App() {
  useEffect(() => {
    setupAuthInterceptor(); // 앱 시작 시 axios 설정에 유저 토큰 넣는 Interceptor 실행.
  }, [])

  return (
    <BottomNav/>
  );
}