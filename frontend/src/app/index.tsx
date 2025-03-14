import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SampleScreen } from "../pages";
import { SampleButton } from "../components";

export default function App() {
  return (
    <>
      <View style={styles.appContainer}>
        <Text>헬로우!</Text>
        <StatusBar style="auto" />
      </View>
      <View style={styles.screenContainer}>
        <SampleScreen />
        <SampleButton title="Sample Button" onPress={() => {}} />
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
    flex: 3,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
