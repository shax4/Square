import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onGoogleButtonPress, requestFirebaseLogin } from "./API/googleAPI";
import { useState } from "react";
import { userDetails } from "../../shared/types/user";
import { loginTemp } from "./API/tempLoginAPI";
import { useAuthStore } from "../../shared/stores";
import { FirebaseLoginResponse } from "./type/googleLoginType";
import SignUpScreen from "../SignupScreen/SignupScreen";
import {styles} from "./style/LandingScreen.style"
import { useAuth } from "../../shared/hooks";
import { getFcmToken } from './API/getFcmtoken';

const LandingScreen = ({ navigation }: any) => {
  const [loginResponse, setLoginResponse] = useState<FirebaseLoginResponse>(); // 로그인 응답 저장용
  const [signUpFlag, setSignUpFlag] = useState<boolean>(false);

  const {setUser} = useAuth();

  const handleGoogleLogin = async () => {
    console.log("Google 계정으로 시작하기");

    try {
      const idToken = await onGoogleButtonPress();

      if (!idToken) {
        Alert.alert("로그인 실패", "Google 로그인에 실패했습니다.");
        return;
      }
      const fcmToken = await getFcmToken();
      console.log("FCM Token + handleGoogleLogin 로그:", fcmToken);
      const response : FirebaseLoginResponse = await requestFirebaseLogin(idToken, fcmToken, "null", "android", "GOOGLE");
      setLoginResponse(response); // 화면에 출력하기 위해 저장

      const userDetails : userDetails = {
        nickname : response.nickname,
        userType: response.userType,
        email: response.email,
        socialType: response.socialType,
        state: "ACTIVE",
        isMember : response.isMember,
        accessToken : response.accessToken,
        refreshToken : response.refreshToken,
      }

      // const userDetails : userDetails = {
      //   nickname : null,
      //   userType: null,
      //   state: "ACTIVE",
      //   isMember : false,
      //   accessToken : null,
      //   refreshToken : null,
      // }

      setUser(userDetails)

      if (!userDetails.isMember) { // 구글 로그인 완료, 서비스 멤버가 아니므로 회원가입 화면으로 이동.
        setSignUpFlag(true);
      }

    } catch (error) {
      console.error("handleGoogleLogin 에러 발생:", error);
      Alert.alert("오류", "Google 로그인 중 문제가 발생했습니다.");
    }
  };

  const handleTempLogin = async () => {
        try {
            const result: userDetails = await loginTemp();

            console.log(result)
            setUser(result);
        } catch (error) {
            console.error("임시 로그인 실패 :", error);
        }
  }

  if (signUpFlag) {
    return (
      <SignUpScreen/>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 로고 및 서비스 정보 */}
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/images/sagak-logo.png")} style={styles.logo} />
          <Text style={styles.serviceName}>서비스 캐치프레이즈</Text>
          <Text style={styles.serviceDescription}>서비스 설명 1~2줄</Text>
        </View>

        {/* 로그인 버튼들 */}
        <View style={styles.loginButtonsContainer}>
          <TouchableOpacity style={[styles.loginButton, styles.googleButton]} onPress={handleGoogleLogin}>
            <Image source={{ uri: "https://via.placeholder.com/20" }} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Google 계정으로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={() => console.log("카카오 로그인")}>
            <Ionicons name="chatbubble" size={20} color="#000000" />
            <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.appleButton]} onPress={() => console.log("애플 로그인")}>
            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
            <Text style={styles.appleButtonText}>Apple 계정으로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.appleButton]} onPress={handleTempLogin}>
            <Text style={styles.appleButtonText}>임시 로그인</Text>
          </TouchableOpacity>
        </View>

        {/* 응답 출력 디버그 영역 */}
        {loginResponse && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>서버 응답:</Text>
            <Text style={styles.debugText}>{JSON.stringify(loginResponse, null, 2)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
