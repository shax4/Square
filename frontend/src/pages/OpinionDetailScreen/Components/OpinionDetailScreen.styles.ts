
import { StyleSheet } from "react-native";
import colors from "../../../../assets/colors";

export const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    ProfileBoxView: {
        margin: 12,
        marginTop: 20,
    },
    OpinionContentView: {
        margin: 15,
    },
    OpinionContentText: {
        fontSize: 17,
    },
    LikeAndCommentCountView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 15,
    },
    CommentCountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    CountText: {
        color: colors.grayText,
        fontSize: 14,
    },
    Separator: {
        height: 0.7,
        backgroundColor: colors.disabledText,
        margin: 12,
    },
    ScrollViewContent: {
        flex: 1,
    },
    CommentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    ProfileAndCommentView: {
    },
    CommentLikeView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    CommentTextView: {
        marginVertical: 15,
        marginLeft: 20,
    },
    CommentText: {
        fontSize: 15,
    },
    CommentCreateView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        marginBottom: 20,
        borderTopColor: colors.disabledText,
    },
    CommentProfileImage: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 20,
        padding: 10,
        maxHeight: 80,
    },
    CommentSendButton: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});