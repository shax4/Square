import React from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../../components/Button";
import { ButtonVariant } from "../../components/Button";
import { TextFieldVariant } from "../../components/TextField";
import TextField from "../../components/TextField";

const UiTestScreen = () => {
  // 각 텍스트 필드에 대한 상태 관리
  const [inputText1, setInputText1] = useState("");
  const [inputText2, setInputText2] = useState("");
  const [inputText3, setInputText3] = useState("");
  const [inputText4, setInputText4] = useState("");
  const [inputText5, setInputText5] = useState("");
  const [inputText6, setInputText6] = useState("");
  const [inputText7, setInputText7] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 활성화된 다음 버튼 */}
        <Button label="다음" onPress={() => console.log("활성화 버튼 클릭")} />
        {/* 비활성화된 다음 버튼 */}
        <Button
          label="다음"
          disabled
          onPress={() => console.log("비활성화 버튼 클릭")}
        />
        {/* 완료 버튼 */}
        <Button label="완료" onPress={() => console.log("완료 버튼 클릭")} />
        {/* 'check' variant: "중복 확인" 버튼 */}
        <Button
          label="중복 확인"
          variant={ButtonVariant.Check}
          onPress={() => console.log("중복 확인 버튼 클릭")}
        />
        {/* 'warning' variant: "경고" 활성화 버튼 */}
        <Button
          label="신고"
          variant={ButtonVariant.Warning}
          onPress={() => console.log("신고 활성화 버튼 클릭")}
        />
        {/* 'delete-id' variant: "회원 탈퇴" 활성화 버튼 */}
        <Button
          label="회원 탈퇴"
          variant={ButtonVariant.DeleteId}
          onPress={() => console.log("회원 탈퇴 활성화 버튼 클릭")}
        />
        {/* 'delete-id' variant && disabled: "회원 탈퇴" 비활성화 버튼 */}
        <Button
          label="회원 탈퇴"
          disabled
          variant={ButtonVariant.DeleteId}
          onPress={() => console.log("회원 탈퇴 비활성화 버튼 클릭")}
        />
        <View style={styles.TextFieldContainer}>
          {/* 기본 TextField */}
          <TextField
            label="기본 텍스트 필드"
            value={inputText1}
            onChangeText={(text: string) => {
              console.log(text);
              setInputText1(text);
            }}
            placeholder="여기에 텍스트를 입력하세요"
          />
          {/* 비밀번호 TextField */}
          <TextField
            label="SecureTextEntry(비밀번호) 필드"
            value={inputText2}
            onChangeText={(text: string) => {
              console.log(text);
              setInputText2(text);
            }}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
          />
          {/* 비활성화된 TextField */}
          <TextField
            label="비활성화된 필드"
            value={inputText3}
            onChangeText={(text: string) => {
              console.log(text);
              setInputText3(text);
            }}
            placeholder="이 필드는 수정할 수 없습니다"
            disabled
          />
          {/* 오류 상태의 TextField */}
          <TextField
            label="오류가 있는 필드"
            value={inputText4}
            onChangeText={(text: string) => {
              console.log(text);
              setInputText4(text);
            }}
            placeholder="오류 메시지가 표시됩니다"
            error="입력값에 문제가 있습니다"
          />
          {/* 여러 줄 입력 TextField */}
          <TextField
            label="여러 줄 입력 필드"
            value={inputText6}
            onChangeText={(text: string) => {
              console.log(text);
              setInputText6(text);
            }}
            placeholder="여러 줄의 텍스트를 입력하세요"
            variant={TextFieldVariant.Multiline}
          />
          {/* 가이드 텍스트 TextField */}
          <TextField
            label="가이드 텍스트 필드"
            value={inputText7}
            onChangeText={(text: string) => {
              console.log(text);
              setInputText7(text);
            }}
            placeholder="닉네임을 입력하세요"
            guide="띄어쓰기, 특수문자를 제외한 10자 이내로 설정해주세요"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 150,
  },
  TextFieldContainer: {
    width: 335,
    alignItems: "center",
  },
});

export default UiTestScreen;
