import { View, StyleSheet } from "react-native";
import ProfileImage from "../ProfileImage";
import PersonalityTag from "../PersonalityTag";
import { getTimeAgo } from "../../shared/utils/timeAge/timeAge";
import { ProfileBoxProps } from "./ProfileBoxProps";
import colors from "../../../assets/colors";
import Text from '../../components/Common/Text';

function ProfileBox({
  imageUrl,
  variant = "medium",
  nickname,
  userType,
  createdAt,
}: ProfileBoxProps) {
  const styles = getStyles(variant); 

  return (
    <View style={styles.Container}>
      <ProfileImage imageUrl={imageUrl} variant={variant} />
      <View style={styles.UserInfoView}>
        <View style={styles.UserNameAndTagView}>
          <Text style={styles.UserNameText}>{nickname}</Text>
          <PersonalityTag personality={userType} nickname={nickname} />
        </View>
        <View>
          <Text weight="medium" style={styles.CreatedTimeText}>
            {getTimeAgo(createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (variant: "small" | "medium" | "large" | "extralarge") => {
    // unknown variant일 경우 대비해서 small로 fallback
    const isSmall = variant === 'small';
    const isMedium = variant === 'medium' || variant === 'large' || variant === 'extralarge';
  
    return StyleSheet.create({
      Container: {
        flexDirection: 'row',
      },
      UserInfoView: {
        marginLeft: isSmall ? 3 : 7,
        marginTop: isSmall ? 0 : 5,
      },
      UserNameAndTagView: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      UserNameText: {
        fontSize: isSmall ? 15 : 17,
        fontWeight: isSmall ? '400' : '500',
        marginRight: isSmall ? 5 : 10
      },
      CreatedTimeText: {
        color: colors.disabledText,
        fontSize: isSmall ? 11 : 12,
      },
    });
  };

export default ProfileBox;
