import { StyleSheet, TouchableOpacity, View } from "react-native"
import Text from '../../../components/Common/Text';

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
            <View style={styles.tabContent}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                {activeTab === tab && <View style={styles.activeIndicator} />}
            </View>
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
    marginLeft: 20,
    marginRight: 20
  },
  tabContent: {
    alignItems: "center", // 텍스트 중앙 정렬
    justifyContent: "center",
    paddingVertical: 12,
    position: "relative",
  },
  tabButton: {
    flex:1,
  },
  tabText: {
    fontSize: 18,
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
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#000000",
    borderRadius: 1,
  },
})

export default TabBar

