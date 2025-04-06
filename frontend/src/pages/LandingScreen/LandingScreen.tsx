import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onGoogleButtonPress, requestFirebaseLogin } from "./API/googleAPI";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

const LandingScreen = ({ navigation }: any) => {
  const [loginResponse, setLoginResponse] = useState<any>(null); // 로그인 응답 저장용

  const handleGoogleLogin = async () => {
    console.log("Google 계정으로 시작하기");

    try {
      const idToken = await onGoogleButtonPress();
      const deviceId = uuidv4();

      if (!idToken) {
        Alert.alert("로그인 실패", "Google 로그인에 실패했습니다.");
        return;
      }

      const response = await requestFirebaseLogin(idToken, null, deviceId, "android", "GOOGLE");
      setLoginResponse(response); // 화면에 출력하기 위해 저장

      if (response?.isMember) {
        navigation.reset({
         index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        navigation.navigate("SignUp", {
          email: response.email,
          socialType: response.socialType,
        });
      }
    } catch (error) {
      console.error("handleGoogleLogin 에러 발생:", error);
      Alert.alert("오류", "Google 로그인 중 문제가 발생했습니다.");
    }
  };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "black",
  },
  serviceDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  loginButtonsContainer: {
    width: "100%",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  kakaoButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  appleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  debugContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#EEE",
    borderRadius: 8,
    width: "100%",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  debugText: {
    fontSize: 14,
    color: "#555",
  },
});

export default LandingScreen;
