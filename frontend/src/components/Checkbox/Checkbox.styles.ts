import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: "#333",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    checkboxChecked: {
      backgroundColor: "#333",
      borderColor: "#333",
    },
    label: {
      fontSize: 14,
      color: "black",
      flex: 1,
    },
  })