import { StyleSheet } from "react-native";
import colors from "../../../../assets/colors";

export const styles = StyleSheet.create({
    bubbleWrapper: {
        marginVertical: 6,
        flexDirection: "row",
        width: "100%",
    },
    alignLeft: {
        justifyContent: "flex-start",
    },
    alignRight: {
        justifyContent: "flex-end",
    },
    bubble: {
        maxWidth: "80%",
        padding: 15,
        borderRadius: 15,
    },
    leftBubble: {
        backgroundColor: colors.yesLight,
        borderTopLeftRadius: 0,
    },
    rightBubble: {
        backgroundColor: colors.noLight,
        borderTopRightRadius: 0,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    nickname: {
        fontWeight: "bold",
        fontSize: 14,
        marginRight: 4,
    },
    contentText: {
        fontSize: 15,
        marginBottom: 8,
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    countText: {
        marginLeft: 4,
        fontSize: 12,
        color: "#444",
    },
    timeText: {
        marginLeft: "auto",
        fontSize: 11,
        color: "#999",
    },
});