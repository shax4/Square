import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const StartScreen = ({ navigation }: any) => {
  const handleKakaoLogin = () => {
    console.log("카카오로 시작하기")
    // After successful login, navigate to SignUpScreen if new user
    //navigation.navigate("SignUp")
  }

  const handleGoogleLogin = () => {
    console.log("Google 계정으로 시작하기")
    // After successful login, navigate to SignUpScreen if new user
    //navigation.navigate("SignUp")
  }

  const handleAppleLogin = () => {
    console.log("Apple 계정으로 시작하기")
    // After successful login, navigate to SignUpScreen if new user
    //navigation.navigate("SignUp")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Service Info */}
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/images/sagak-logo.png")} style={styles.logo} />
          <Text style={styles.serviceName}>서비스 캐치프레이즈</Text>
          <Text style={styles.serviceDescription}>서비스 설명 1~2줄</Text>
        </View>

        {/* Login Buttons */}
        <View style={styles.loginButtonsContainer}>
          <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={handleKakaoLogin}>
            <Ionicons name="chatbubble" size={20} color="#000000" />
            <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.googleButton]} onPress={handleGoogleLogin}>
            <Image source={{ uri: "https://via.placeholder.com/20" }} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Google 계정으로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.appleButton]} onPress={handleAppleLogin}>
            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
            <Text style={styles.appleButtonText}>Apple 계정으로 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
})

export default StartScreen

