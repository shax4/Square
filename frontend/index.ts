import messaging from '@react-native-firebase/messaging';
import { registerRootComponent } from 'expo';

import App from './src/app';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📲 [FCM - Background] 메시지 수신:', remoteMessage);
    // 여기서 local notification 띄우는 로직도 추가 가능
  });
  

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
