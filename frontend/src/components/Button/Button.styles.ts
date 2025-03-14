import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // 기본 상태
  container: {
    width: 335,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066FF",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.32,
    textAlign: "center",
  },
  // 비활성화 상태
  containerDisabled: {
    backgroundColor: "#434750",
  },
  labelDisabled: {
    color: "#666a73",
  },
  // variant가 다를 때를 위한 예시
  containerSecondary: {
    backgroundColor: "#444444",
  },
});
