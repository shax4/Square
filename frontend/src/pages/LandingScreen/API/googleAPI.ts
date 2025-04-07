import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { axiosInstance } from '../../../shared';
import { FirebaseLoginResponse } from '../type/googleLoginType';

// GoogleSignin.configure({
//   webClientId: process.env.EXPO_PUBLIC_GOOGLE_URL,
// });

export async function onGoogleButtonPress(): Promise<string | null> {
  // try {
  //   const data = await GoogleSignin.signIn();
  //   const googleCredential = auth.GoogleAuthProvider.credential(data.data?.idToken!);
  //   const userCredential = await auth().signInWithCredential(googleCredential);
  //   const firebaseIdToken = await userCredential.user.getIdToken();
  //   return firebaseIdToken;
  // } catch (error) {
  //   console.error("Google 로그인 실패:", error);
  //   return null;
  // }
  return ""
}

export async function requestFirebaseLogin(
  idToken: string,
  fcmToken: string | null,
  deviceId: string,
  deviceType: string,
  socialType: string
): Promise<FirebaseLoginResponse> {
  try {
    const response = await axiosInstance.post("/api/auth/firebase", {
      idToken,
      fcmToken,
      deviceId,
      deviceType,
      socialType
    });
    return response.data;
  } catch (error) {
    console.error("requestFirebaseLogin 오류:", error);
    throw error;
  }
}
