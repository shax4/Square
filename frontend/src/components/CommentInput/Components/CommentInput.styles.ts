import { StyleSheet } from "react-native";
import colors from "../../../../assets/colors";
import { Dimensions } from 'react-native';
const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get("window")

export const styles = StyleSheet.create({

    TotalView: {

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
        width: SCREEN_WIDTH * 0.7,
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
    ErrorInfoView: {
        alignItems: 'center',
    },
    ErrorINfoText: {
        color: colors.warnRed,
    }
})