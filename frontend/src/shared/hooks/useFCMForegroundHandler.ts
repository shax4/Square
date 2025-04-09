import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const useFCMForegroundHandler = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification || {};
      const { type, targetId, debateId } = remoteMessage.data || {};

      console.log('[FCM] 포그라운드 알림 수신', type, targetId, debateId);

      await notifee.displayNotification({
        title: title ?? '알림',
        body: body ?? '',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'navigate', // 클릭 이벤트용 ID
          },
        },
        data: {
          type: type ?? '',
          targetId: targetId ?? '',
          debateId: debateId ?? '',
        },
      });
    });

    return unsubscribe;
  }, []);
};
