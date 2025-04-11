import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F8F8",
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 60,
    },
    logo: {
      width: 250,
      height: 250,
      marginBottom: 20,
    },
    serviceName: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 8,
      color: "black",
    },
    serviceDescription: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
    },
    loginButtonsContainer: {
      width: "100%",
    },
    loginButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 8,
      marginBottom: 12,
    },
    kakaoButton: {
      backgroundColor: "#FEE500",
    },
    kakaoButtonText: {
      color: "#000000",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    googleButton: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#DDDDDD",
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    googleButtonText: {
      color: "#000000",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    appleButton: {
      backgroundColor: "#000000",
    },
    appleButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    debugContainer: {
      marginTop: 30,
      padding: 16,
      backgroundColor: "#EEE",
      borderRadius: 8,
      width: "100%",
    },
    debugTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#333",
    },
    debugText: {
      fontSize: 14,
      color: "#555",
    },
  });