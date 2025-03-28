import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../../shared/hooks";
import { signup } from "./authApi";
import { userDetails } from "../../shared/stores/auth";

const SignupTestScreen = () => {
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    nickname: "",
    fileName: "",
    region: "",
    gender: "",
    yearOfBirth: "",
    religion: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      const signupData = {
        ...form,
        yearOfBirth: Number(form.yearOfBirth),
      };

      const response = await signup(signupData);
      const user = response.data;
      const accessToken = response.headers["accessToken"];

      if (!accessToken) {
        Alert.alert("오류", "토큰이 정상적으로 반환되지 않았습니다.");
        return;
      }

    const userData: userDetails = {
        nickname: user.nickname,
        userType: user.userType,
        token: accessToken,
    }

      setUser(userData);

      Alert.alert("회원가입 성공!", `환영합니다, ${user.nickname}님!`);
    } catch (error) {
      console.error("회원가입 실패:", error);
      Alert.alert("회원가입 실패", "다시 시도해주세요.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>닉네임</Text>
      <TextInput
        value={form.nickname}
        onChangeText={(value) => handleInputChange("nickname", value)}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>프로필 이미지 파일명</Text>
      <TextInput
        value={form.fileName}
        onChangeText={(value) => handleInputChange("fileName", value)}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>지역</Text>
      <TextInput
        value={form.region}
        onChangeText={(value) => handleInputChange("region", value)}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>성별</Text>
      <TextInput
        value={form.gender}
        onChangeText={(value) => handleInputChange("gender", value)}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>출생 연도</Text>
      <TextInput
        value={form.yearOfBirth}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("yearOfBirth", value)}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>종교</Text>
      <TextInput
        value={form.religion}
        onChangeText={(value) => handleInputChange("religion", value)}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Button title="회원가입" onPress={handleSignup} />
    </View>
  );
};

export default SignupTestScreen;
