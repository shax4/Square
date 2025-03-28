import { View, Text, StyleSheet } from "react-native";
import ProfileImage from "../ProfileImage";
import PersonalityTag from "../PersonalityTag";
import { getTimeAgo } from "../../shared/utils/timeAge/timeAge";
import { ProfileBoxProps } from "./ProfileBoxProps";
import colors from "../../../assets/colors";

function ProfileBox({
    imageUrl,
    variant = "medium",
    nickname,
    userType,
    createdAt,
}: ProfileBoxProps) {
    return (
        <View style={styles.Container}>
            <ProfileImage
                imageUrl={imageUrl}
                variant={variant}
            />
            <View style={styles.UserInfoView}>
                <View style={styles.UserNameAndTagView}>
                    <Text style={styles.UserNameText}> {nickname} </Text>
                    <PersonalityTag personality={userType} />
                </View>
                <View style={styles.CreatedTimeTextView}>
                    <Text style={styles.CreatedTimeText}>{getTimeAgo(createdAt)}</Text>
                </View>
            </View>
        </View>

    )
}

export const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row'
    },
    UserInfoView: {
    },
    UserNameAndTagView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    UserNameText: {
        fontSize: 17,
        fontWeight: 500,
    },
    CreatedTimeTextView: {

    },
    CreatedTimeText: {
        color: colors.disabledText,
        fontSize: 12,
        marginLeft: 5,
    }
});
export default ProfileBox;