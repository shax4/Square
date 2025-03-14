import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // variant: primary(기본) 활성화 컨테이너
  container: {
    width: 335,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066FF",
  },
  // primary 활성화 라벨
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.32,
    textAlign: "center",
  },
  // primary 비활성화 컨테이너
  containerDisabled: {
    backgroundColor: "#434750",
  },
  // primary 비활성화 라벨
  labelDisabled: {
    color: "#666a73",
  },
  // variant: check(중복 확인) 컨테이너
  containerCheck: {
    width: 81,
    height: 51,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066FF",
  },
});
