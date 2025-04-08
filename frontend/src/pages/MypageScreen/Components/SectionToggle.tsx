import { StyleSheet, TouchableOpacity, View } from "react-native"
import Text from '../../../components/Common/Text';

type SectionToggleProps = {
  sections: string[]
  activeSection: string
  onSectionChange: (section: string) => void
}

const SectionToggle = ({ sections, activeSection, onSectionChange }: SectionToggleProps) => {
  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section}
          style={[styles.sectionButton, activeSection === section && styles.activeSection]}
          onPress={() => onSectionChange(section)}
        >
          <Text style={[styles.sectionText, activeSection === section && styles.activeSectionText]}>{section}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 4,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeSection: {
    backgroundColor: "#FFFFFF",
  },
  sectionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#888888",
  },
  activeSectionText: {
    color: "#000000",
    fontWeight: "600",
  },
})

export default SectionToggle

