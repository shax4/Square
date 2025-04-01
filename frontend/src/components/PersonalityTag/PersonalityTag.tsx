import { TouchableOpacity, Text } from "react-native";
import { PersonalityTagProps } from "./PersonalityTag.types";
import { styles } from "./PersonalityTag.styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../shared/page-stack/MyPageStack";


const PersonalityTag = ({ personality, nickname }: PersonalityTagProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 클릭 시 성향 상세 페이지로 이동
    const onPressPersonalityTag = () => {
        navigation.navigate("PersonalityResultScreen", { nickname: nickname });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPressPersonalityTag} activeOpacity={0.7}>
            <Text style={styles.text}>{personality}</Text>
        </TouchableOpacity>
    );
};

export default PersonalityTag;