import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Opinion } from "./Opinion.types";
import { getTimeAgo } from "../../../../shared/utils/timeAge/timeAge";
import { ProfileImage, PersonalityTag } from "../../../../components";
import { styles } from '../ContentBubble.styles';

import { AntDesign, Feather } from '@expo/vector-icons'; // 하트/댓글 아이콘용
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DebateStackParamList } from "../../../../shared/page-stack/DebatePageStack";
import Text from '../../../../components/Common/Text';



interface Props {
    debateId: number;
    opinion: Opinion;
}

const OpinionBox = ({ debateId, opinion }: Props) => {
    const {
        opinionId,
        content,
        nickname,
        userType,
        profileUrl,
        isLeft,
        isLiked,
        likeCount,
        commentCount,
        createdAt,
    } = opinion;

    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const routeOpinionDetailScreen = () => {
        navigation.navigate('OpinionDetailScreen', { debateId, opinionId });
    }

    return (
        <TouchableOpacity
            style={[
                styles.bubbleWrapper,
                isLeft ? styles.alignLeft : styles.alignRight,
            ]}
            onPress={routeOpinionDetailScreen}
        >
            <View
                style={[
                    styles.bubble,
                    isLeft ? styles.leftBubble : styles.rightBubble,
                ]}
            >
                {/* 상단: 프로필, 닉네임, userType */}
                <View style={styles.topRow}>
                    <ProfileImage
                        imageUrl={profileUrl}
                        variant="small"
                    />
                    <Text style={styles.nickname}>{nickname}</Text>
                    <PersonalityTag
                        personality={userType}
                        nickname={nickname}
                    />
                </View>

                {/* 본문 */}
                <Text weight="medium" style={styles.contentText}>{content}</Text>

                {/* 하단: 하트, 댓글, 시간 */}
                <View style={styles.bottomRow}>
                    <AntDesign
                        name={isLiked ? "heart" : "hearto"}
                        size={16}
                        color={isLiked ? "red" : "gray"}
                    />
                    <Text style={styles.countText}>{likeCount}</Text>

                    <Feather name="message-circle" size={16} color="gray" style={{ marginLeft: 12 }} />
                    <Text style={styles.countText}>{commentCount}</Text>

                    <Text weight="medium" style={styles.timeText}>{getTimeAgo(createdAt)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OpinionBox;
