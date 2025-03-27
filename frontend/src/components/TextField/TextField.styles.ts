import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";

export const styles = StyleSheet.create({
  // 전체 TextField 컨테이너 스타일
  fieldContainer: {
    width: "100%",
    marginBottom: 16,
  },
  // 기본 TextField 컨테이너 스타일
  container: {
    width: 335,
    height: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1E1E6",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  // 포커스된 필드 스타일
  containerFocused: {
    borderColor: colors.primary,
  },
  // 여러 줄 입력(Multiline) 필드 스타일
  containerMultiline: {
    height: undefined,
    minHeight: 51,
    maxHeight: 24 * 8, // lineHeight * maxLines
    textAlignVertical: "center", // android 옵션, iOS에서는 기본 옵션이기에 무시됨: 내부의 텍스트를 수직 방향으로 정렬 (top: 상단)
  },
  // 비활성화된 TextField 컨테이너 스타일
  containerDisabled: {
    backgroundColor: "#F2F2F7",
    borderColor: "#E1E1E6",
  },
  // 오류 상태의 TextField 컨테이너 스타일
  containerError: {
    borderColor: colors.warnRed,
  },
  // TextField 라벨 스타일
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 8,
  },
  // 기본 입력 텍스트 스타일
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24, // 줄 간격 추가 (텍스트 크기의 약 1.5배)
    color: colors.black,
  },
  // 비활성화된 입력 텍스트 스타일
  inputDisabled: {
    color: colors.disabledText,
  },
  // 오류 상태의 입력 텍스트 스타일
  inputError: {
    color: colors.black,
  },
  // 오류 메시지 텍스트 스타일
  errorText: {
    fontSize: 12,
    color: colors.warnRed,
    marginTop: 4,
    marginLeft: 16,
  },
  // 플레이스홀더 텍스트 스타일
  placeholder: {
    color: colors.placeholderText,
  },
  // 가이드 텍스트 스타일
  guideText: {
    fontSize: 12,
    color: colors.placeholderText,
    marginTop: 4,
    paddingLeft: 16,
  },
});
