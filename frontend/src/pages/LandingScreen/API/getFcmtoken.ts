import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export async function getFcmToken(): Promise<string | null> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('알림 권한이 거부되었습니다.');
      return null;
    }

    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('FCM 토큰 요청 실패:', error);
    return null;
  }
}
