import { Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {styles} from "./Checkbox.styles"
import {CheckboxProps} from "./Checkbox.types"

const Checkbox = ({ label, checked, onToggle }: CheckboxProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color={"white"} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

export default Checkbox

