import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type TabBarProps = {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

const TabBar = ({ tabs, activeTab, onTabChange }: TabBarProps) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => onTabChange(tab)}>
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          {activeTab === tab && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: "relative",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888888",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "#000000",
    borderRadius: 1,
  },
})

export default TabBar

