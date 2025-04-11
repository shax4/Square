import auth, { GoogleAuthProvider } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { axiosInstance } from '../../../shared';
import { FirebaseLoginResponse } from '../type/googleLoginType';

GoogleSignin.configure({
  webClientId: '723204356630-i359pe45km1o1u81leihfd77kud4prla.apps.googleusercontent.com'
  ,
});

export async function onGoogleButtonPress(): Promise<string | null> {
  try {
    const data = await GoogleSignin.signIn();
    console.log("Google 로그인 성공:", data);
    const googleCredential = GoogleAuthProvider.credential(data.data?.idToken!);
    console.log("구글 자격 증명:", googleCredential);
    const userCredential = await auth().signInWithCredential(googleCredential);
    console.log("Firebase 로그인 성공:", userCredential);
    const firebaseIdToken = await userCredential.user.getIdToken();
    console.log("Firebase ID Token:", firebaseIdToken);
    return firebaseIdToken;
  } catch (error) {
    console.error("Google 로그인 실패:", error);
    return null;
  }
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
