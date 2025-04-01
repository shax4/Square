import { StyleSheet } from "react-native";
import colors from "../../../../assets/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    topicView: {
        maxHeight: 100,
        minHeight: 60,
        alignItems: 'flex-start',
        margin: 12,
        flexWrap: 'wrap',
    },
    topicViewText: {
        margin: 10,
        fontSize: 30,
        fontWeight: '600',
    },
    optionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
    },
    optionTextLeft: {
        width: '30%',
        height: 40,
        lineHeight: 40,
        backgroundColor: colors.yesLight,
        fontSize: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    optionTextRight: {
        width: '30%',
        height: 40,
        lineHeight: 40,
        backgroundColor: colors.noLight,
        fontSize: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    opinionView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    opinionTypeToggleView: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    bottomContainer: {
        width: '100%',
    },
    VoteButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 15,
    },
    VoteButtonViewSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 10,
    },
    TotalVoteCountView: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.white,
        paddingBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#eeeeee',
        borderRadius: 15,
        marginHorizontal: 20,
        padding: 4,
        marginBottom: 10,
        alignItems: 'center',
    },
    tabButton: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        color: '#888',
        fontWeight: '500',
    },
    selectedTabButton: {
        backgroundColor: '#ffffff',
        color: '#000',
    },
});