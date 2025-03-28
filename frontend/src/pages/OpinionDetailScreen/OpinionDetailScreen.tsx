import { RouteProp, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import opinionDetailTestData from './Components/opinion-detail-test-data';
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import colors from "../../../assets/colors";

type OpinionDetailRouteProp = RouteProp<StackParamList, 'OpinionDetailScreen'>;

export default function OpinionDetailScreen() {

    const route = useRoute<OpinionDetailRouteProp>();
    const { opinionId } = route.params;
    const response = opinionDetailTestData;
    return (
        <View style={styles.Container}>
            <View style={styles.ProfileBoxView}>
                <ProfileBox
                    //imageUrl={response.profileUrl}
                    nickname={response.nickname}
                    userType={response.userType}
                    createdAt={response.createdAt}
                    variant="medium"
                />
            </View>
            <View>
                <Text>{response.content}</Text>
            </View>

        </View>


    )
}

export const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    ProfileBoxView: {
        flex: 1,
        margin: 12,
    },
});