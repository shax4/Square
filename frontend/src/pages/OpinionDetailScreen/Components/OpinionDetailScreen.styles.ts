
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
        marginRight: 15,
        marginLeft: 20,
    },
    OpinionContentText: {
        fontSize: 17,
    },
    LikeAndCommentCountView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 10,
    },
    CommentCountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    CountText: {
        color: colors.grayText,
        fontSize: 14,
        marginLeft: 4,
        marginTop: 1
    },
    Separator: {
        height: 1,
        backgroundColor: colors.grayText,
        marginHorizontal: 12,
        marginTop: 12,
    },
    ScrollViewContent: {
        flex: 1,
    },
    CommentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginLeft: 20,
        marginTop: 12,
        marginBottom: 4,
        marginRight: 12
    },
    ProfileAndCommentView: {
        flex: 1,
        marginTop: 7
    },
    CommentLikeView: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginHorizontal: 12,
    },
    CommentTextView: {
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 10,
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
    CommentSeparator: {
        height: 0.5,
        backgroundColor: colors.grayText,
        marginHorizontal: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        paddingBottom: 30,
        paddingTop: 10,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalButton: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalButtonText: {
        fontSize: 16,
        color: '#333',
    },
    modalCancelButtonText: {
        fontSize: 16,
        color: 'red',
    },
    ModalPadding: {
        height: 30
    }

});