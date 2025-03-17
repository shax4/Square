import { TouchableOpacity, Text } from "react-native";
import { PersonalityTagProps } from "./PersonalityTag.types";
import {styles} from "./PersonalityTag.styles";

const PersonalityTag = ({personality, onPress} : PersonalityTagProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.text}>{personality}</Text>
        </TouchableOpacity>
    );
};

export default PersonalityTag;