import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../assets/colors';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");


export const styles = StyleSheet.create({
    Container: {
        marginLeft: 15,
        marginRight: 15,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    VoteButtonBase: {
        width: '45%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 15,
    },
    VoteNotSelectedLeft: {
        backgroundColor: colors.yesLight,
    },
    VoteNotSelectedRight: {
        backgroundColor: colors.noLight,
    },
    VoteSelectedLeft: {
        backgroundColor: colors.yesDark,
    },
    VoteSelectedRight: {
        backgroundColor: colors.noDark,
    },

    VoteButtonBeforeVoteLeft: {
        backgroundColor: colors.yesLight,
        width: '45%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    VoteButtonBeforeVoteRight: {
        backgroundColor: colors.noLight,
        width: '45%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    VoteButtonSelectedLeft: {
        backgroundColor: colors.yesDark,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    VoteButtonSelectedRight: {
        backgroundColor: colors.noDark,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    VoteButtonNotSelectedLeft: {
        backgroundColor: colors.yesLight,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    VoteButtonNotSelectedRight: {
        backgroundColor: colors.noLight,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    VoteIcon: {
        fontSize: 30,
    },
    VoteContents: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    VoteMainText: {
        fontSize: 18,
    },
    VoteSubText: {
        fontSize: 12,
    },
    VoteTextBeforeLeft: {
        color: colors.yesDark,
    },
    VoteTextBeforeRight: {
        color: colors.noDark,
    },
    VoteTextSelectedLeft: {
        color: colors.white,
    },
    VoteTextSelectedRight: {
        color: colors.white,
    },
    VoteTextNotSelected: {
        color: colors.grayText,
    },
    VoteEmojiImage: {
        width: 24,
        height: 24,
        marginRight: 4,
    },

});