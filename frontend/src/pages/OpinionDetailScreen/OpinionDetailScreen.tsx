import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import opinionDetailTestData from './Components/opinion-detail-test-data';

type OpinionDetailRouteProp = RouteProp<StackParamList, 'OpinionDetailScreen'>;

export default function OpinionDetailScreen() {

    const route = useRoute<OpinionDetailRouteProp>();
    const { opinionId } = route.params;

    return (
        <View>


        </View>

    )
}