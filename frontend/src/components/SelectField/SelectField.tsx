import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type SelectFieldProps = {
  label: string
  value: string
  placeholder?: string
  onPress: () => void
}

const SelectField = ({ label, value, placeholder = "선택해 주세요", onPress }: SelectFieldProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.selectContainer}>
        <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color="#888888" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "black",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  value: {
    fontSize: 16,
    color: "black",
  },
  placeholder: {
    color: "#AAAAAA",
  },
})

export default SelectField

