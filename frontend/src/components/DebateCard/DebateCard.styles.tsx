import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../assets/colors';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
    CardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Card: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.6,
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
    },
    CardMarginTop: {
        height: SCREEN_HEIGHT * 0.1,
    },
    CardMarginBottom: {
        height: SCREEN_HEIGHT * 0.3,
    },
    CardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    CardHeaderText: {
        fontSize: 20,
    },
    CardHashtag: {
        paddingLeft: 10,
    },
    CardTopic: {
        flex: 4,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    CardTopicText: {
        fontSize: 40,
    },
    CardVote: {
        flex: 3,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    CardUnvotedLeftButton: {
        backgroundColor: colors.yesLight,
        width: '45%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardUnvotedRightButton: {
        backgroundColor: colors.noLight,
        width: '45%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVotedLeftButton: {
        backgroundColor: colors.yesDark,
        width: '45%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVotedRightButton: {
        backgroundColor: colors.noDark,
        width: '45%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVoteIcon: {
        fontSize: 35,
    },
    CardVoteText: {
        fontSize: 20,
    },
    CardFooter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.yesDark,
    },
    CardFooterText: {
        color: 'white',
    },
    CardListView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});