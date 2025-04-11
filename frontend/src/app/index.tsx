import { View } from 'react-native';
import BottomNav from './navigation/BottomNav';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { useFirebaseMessaging } from '.././shared/hooks/useFirebaseMessaging';
import { useFCMForegroundHandler } from '../shared/hooks/useFCMForegroundHandler';
import { useNotificationClickHandler } from '../shared/hooks/useNotificationClickHandler';
import { useNotificationSetup } from '../shared/hooks/useNotificationSetup'; 


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf'),
  });


  useNotificationSetup();
  useFirebaseMessaging();
  useFCMForegroundHandler()
  useNotificationClickHandler(); 

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <BottomNav />
    </View>
  );
  }
