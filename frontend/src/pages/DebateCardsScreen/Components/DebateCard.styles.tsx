import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../../assets/colors';
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
        padding: 13,
        marginLeft: 15,
        marginRight: 10,
        marginTop: 10,
    },
    CardHeaderText: {
        fontSize: 20,
        color: colors.grayText,
    },
    CardHashtag: {
        marginLeft: 15,
        paddingLeft: 10,
        marginTop: 10,
        justifyContent: 'center',
    },
    CardHashtagText: {
        height: 30,
        backgroundColor: colors.hashtag,
        fontSize: 15,
        borderRadius: 15,
        lineHeight: 30,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
    },
    CardTopic: {
        flex: 4,
        justifyContent: 'center',
        marginLeft: 15,
    },
    CardTopicText: {
        marginLeft: 10,
        marginRight: 50,
        fontSize: 35,
    },
    CardVote: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    CardVoteButtonBeforeVoteLeft: {
        backgroundColor: colors.yesLight,
        width: '45%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVoteButtonBeforeVoteRight: {
        backgroundColor: colors.noLight,
        width: '45%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVoteButtonSelectedLeft: {
        backgroundColor: colors.yesDark,
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVoteButtonSelectedRight: {
        backgroundColor: colors.noDark,
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVoteButtonNotSelectedLeft: {
        backgroundColor: colors.yesLight,
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    CardVoteButtonNotSelectedRight: {
        backgroundColor: colors.noLight,
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

    // modal
    overlay: {
        flex: 1,
        backgroundColor: colors.blurbackgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: colors.white,
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 40
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 15
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
    },
    cancelButton: {
        width: '45%',
        height: 50,
        backgroundColor: colors.cancelButton,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: 15,
        color: colors.black,
    },
    confirmButton: {
        width: '45%',
        height: 50,
        backgroundColor: colors.yesDark,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 15,
        color: colors.white,
    }
});