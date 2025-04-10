// shared/hooks/useNotificationSetup.ts
import { useEffect } from 'react';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const useNotificationSetup = () => {
  useEffect(() => {
    const setup = async () => {
      try {
        const settings = await notifee.requestPermission();

        console.log('알림 권한 상태:', settings.authorizationStatus);

        await notifee.createChannel({
          id: 'default',
          name: '기본 알림 채널',
          importance: AndroidImportance.HIGH,
        });

        console.log('알림 채널 생성 완료');
      } catch (error) {
        console.warn('알림 설정 중 오류 발생:', error);
      }
    };

    setup();
  }, []);
};
