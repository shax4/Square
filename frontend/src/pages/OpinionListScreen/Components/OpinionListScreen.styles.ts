import { StyleSheet } from "react-native";
import colors from "../../../../assets/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    topicView: {
        maxHeight: 100,
        minHeight: 60,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 5
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
        marginBottom: 20,
        gap: 200,
    },
    optionTextLeft: {
        height: 40,
        lineHeight: 40,
        fontSize: 13,
        borderRadius: 15,
        textAlign: 'center',
        color: colors.yesDark

    },
    optionTextRight: {
        height: 40,
        lineHeight: 40,
        fontSize: 13,
        borderRadius: 15,
        textAlign: 'center',
        color: colors.noDark
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

    optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 50,
        paddingVertical: 1,
        paddingHorizontal: 6,
        flex: 1,
    },

    optionBoxLeft: {
        backgroundColor: colors.white,
    },

    optionBoxRight: {
        backgroundColor: '#e4e4e4',
    },

    optionImage: {
        width: 18,
        height: 18,
        marginRight: 8,
        marginLeft: 10
    },

    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
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
        paddingVertical: 15,
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
        padding: 3,
        marginBottom: 20,
        alignItems: 'center',
    },
    tabButton: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 8,
        borderRadius: 14,
        color: '#888',
        fontWeight: '500',
    },
    selectedTabButton: {
        backgroundColor: '#ffffff',
        color: '#000',
    },
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});