import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#EAF2FE",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#0066FF",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.2,
    },
    disabled: {
        backgroundColor: "#D3D3D3", // 연한 회색으로 변경
        opacity: 0.6, // 투명도를 낮춰 비활성화 느낌 강조
    },
    disabledText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 1.2,
    },
})