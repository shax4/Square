import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Opinion } from "./OpinionProps";
import { getTimeAgo } from "../../shared/utils/timeAge/timeAge";
import { ProfileImage, PersonalityTag } from "../../components";
import { styles } from './OpinionBubble.styles';

import { AntDesign, Feather } from '@expo/vector-icons'; // 하트/댓글 아이콘용

interface Props {
    opinion: Opinion;
}

const OpinionBubble = ({ opinion }: Props) => {
    const {
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

    return (
        <View
            style={[
                styles.bubbleWrapper,
                isLeft ? styles.alignLeft : styles.alignRight,
            ]}
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
                    <PersonalityTag personality={userType} />
                </View>

                {/* 본문 */}
                <Text style={styles.contentText}>{content}</Text>

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

                    <Text style={styles.timeText}>{getTimeAgo(createdAt)}</Text>
                </View>
            </View>
        </View>
    );
};

export default OpinionBubble;
