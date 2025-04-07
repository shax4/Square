import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  containerHorizontal: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  icon: {
    marginBottom: 4,
  },
  likeCount: {
    fontWeight: "bold",
    color: "gray",
    marginLeft: 3,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 4,
    padding: 4,
    minWidth: 65,
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
    maxWidth: 80,
  },
  verticalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  button: {
    padding: 4,
  },
  countContainer: {
    marginTop: 4,
    alignItems: "center",
    flexDirection: "row",
  },
  countText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },
  simpleErrorIcon: {
    marginLeft: 4,
  },
});
