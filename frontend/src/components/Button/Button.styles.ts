import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";

export const styles = StyleSheet.create({
  // variant: primary(기본) 활성화 컨테이너
  container: {
    width: 335,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  // primary 활성화 라벨
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.32,
    textAlign: "center",
  },
  // primary 비활성화 컨테이너
  containerDisabled: {
    backgroundColor: colors.disabledBg,
  },
  // primary 비활성화 라벨
  labelDisabled: {
    color: colors.disabledText,
  },
  // variant: check(중복 확인) 컨테이너
  containerCheck: {
    width: 81,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  // variant: warning(경고) 활성화 컨테이너
  containerWarning: {
    backgroundColor: colors.warnRed,
  },
  // variant: deleteId(회원탈퇴) 활성화 컨테이너
  containerDeleteId: {
    width: 145,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.warnRed,
  },
  // variant: deleteId(회원탈퇴) 비활성화 컨테이너
  containerDisabledDeleteId: {
    width: 145,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.disabledWarn,
  },
});
