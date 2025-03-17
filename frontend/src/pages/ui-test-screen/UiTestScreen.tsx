import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { ButtonVariant } from "../../components/Button";

const UiTestScreen = () => {
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UiTestScreen;
