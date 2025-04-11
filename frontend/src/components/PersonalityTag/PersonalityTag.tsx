import { TouchableOpacity} from "react-native";
import { PersonalityTagProps } from "./PersonalityTag.types";
import { styles } from "./PersonalityTag.styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../shared/page-stack/MyPageStack";
import Text from '../../components/Common/Text';


const PersonalityTag = ({ personality, nickname }: PersonalityTagProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 클릭 시 성향 상세 페이지로 이동
    const onPressPersonalityTag = () => {
        navigation.navigate("PersonalityResultScreen", { isAfterSurvey : false, givenNickname : nickname, typeResult : null});
    };

    return (
        <TouchableOpacity
            style={[styles.container, !personality && styles.disabled]}
            onPress={personality ? onPressPersonalityTag : undefined}
            activeOpacity={personality ? 0.7 : 1}
            disabled={!personality}
        >
            <Text style={[styles.text, !personality && styles.disabledText]}>{personality ?? "성향 없음"}</Text>
        </TouchableOpacity>
    );
};

export default PersonalityTag;