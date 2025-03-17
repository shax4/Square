import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/Button";

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
        variant="check"
        onPress={() => console.log("중복 확인 버튼 클릭")}
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
