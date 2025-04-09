import {StyleSheet, Dimensions} from 'react-native';

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: width * 0.97,
    maxWidth: 400,
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: "95%",
    flex: 1,
  },
  header: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
  },
  closeButton: {
    position: "absolute",
    right: 16,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chartContainer: {
    height: 300,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})