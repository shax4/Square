import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    containerHorizontal: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        marginLeft: 10,
    },
    icon: {
        marginBottom: 4,
    },
    likeCount: {
        fontWeight: "bold",
        color: "gray",
    },
});