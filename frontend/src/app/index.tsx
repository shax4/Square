import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SampleScreen, UiTestScreen } from "../screens";
import { SampleButton } from "../components";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.appContainer}>
        <Text>헬로우!</Text>
      </View>
      <View style={styles.screenContainer}>
        <UiTestScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  screenContainer: {
    flex: 5,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
