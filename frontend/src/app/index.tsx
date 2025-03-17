import { StyleSheet, Text, View } from 'react-native';
import BottomNav from './navigation/BottomNav';

export default function App() {
  return (
    <BottomNav/>
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
