// src/hooks/useFirebaseMessaging.ts
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export const useFirebaseMessaging = () => {
  useEffect(() => {
    // 포그라운드 수신
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('[FCM - Foreground]', remoteMessage);
    //   Alert.alert(remoteMessage.notification?.title ?? '알림', remoteMessage.notification?.body ?? '');
    // });

    // 백그라운드 → 알림 클릭
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('[FCM - Background Click]', remoteMessage);
      // 예: navigation.navigate(...)
    });

    // 종료 상태 → 알림 클릭
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('[FCM - Killed Click]', remoteMessage);
          // 예: navigation.navigate(...)
        }
      });

    return () => {
      // unsubscribe();
      unsubscribeOpened();
    };
  }, []);
};
