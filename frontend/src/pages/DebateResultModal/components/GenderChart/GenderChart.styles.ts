import {StyleSheet} from "react-native"

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  labelsContainer: {
    width: "100%",
    height: 30,
    position: "relative",
    marginBottom: 5,
    marginLeft: 40,
  },
  labelItem: {
    position: "absolute",
    alignItems: "center",
  },
  labelText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
  },
  barContainer: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    borderRadius: 15,
    overflow: "hidden",
  },
  barSection: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})