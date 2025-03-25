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
});