import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ProfileImage from "../../../components/ProfileImage";
import LikeButton from "../../../components/LikeButton";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";
import { Icons } from "../../../../assets/icons/Icons";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import Text from '../../../components/Common/Text';
import colors from "../../../../assets/colors";

// 게시글 아이템 타입 정의
interface BoardItemProps {
  item: {
    postId: number;
    title: string;
    content: string;
    nickname: string;
    profileUrl?: string;
    userType: string | null;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
  };
  onPress: () => void;
}

/**
 * 게시판 목록의 각 게시글 아이템을 렌더링하는 컴포넌트
 * @param item - 게시글 데이터 객체
 * @param onPress - 게시글 클릭 시 실행될 함수
 */
export default function BoardItem({ item, onPress }: BoardItemProps) {
  // 로컬 상태 추가
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [isLiked, setIsLiked] = useState(item.isLiked);

  // 게시글 내용을 미리보기 형태로 자름 (최대 100자)
  const contentPreview =
    item.content.length > 100
      ? `${item.content.substring(0, 100)}...`
      : item.content;

  const likeProps = useLikeButton(
    item.postId,
    "POST",
    isLiked,
    likeCount,
    (newState) => {
      setLikeCount(newState.likeCount);
      setIsLiked(newState.isLiked);
    }
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7} // 터치 시 약간의 투명도 변화
    >
      {/* 작성자 정보 영역 */}
      <View style={styles.header}>
        <ProfileImage imageUrl={item?.profileUrl} variant="medium" />
        <View style={styles.authorInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.authorName}>{item.nickname}</Text>
            <PersonalityTag
              personality={item.userType}
              nickname={item.nickname}
            />
          </View>
          <Text weight="medium" style={styles.date}>{getTimeAgo(item.createdAt)}</Text>
        </View>
      </View>

      {/* 게시글 내용 영역 */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text weight="medium" style={styles.preview} numberOfLines={2}>
          {contentPreview}
        </Text>
      </View>

      {/* 하단 정보 영역 (좋아요 수, 댓글 수) */}
      <View style={styles.footer}>
        <View style={styles.interactionContainer}>
          <LikeButton {...likeProps} size="large" isVertical={false} />
          <View style={styles.commentCountContainer}>
            <Icons.commentNew />
            <Text weight="medium" style={styles.commentCountText}>{item.commentCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // 안드로이드 그림자 효과
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 1
  },
  authorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
  },
  date: {
    fontSize: 12,
    color: colors.grayText,
  },
  content: {
    marginBottom: 5,
    marginLeft: 4

  },
  title: {
    fontSize: 17,
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  commentCountText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "gray",
    marginLeft: 4,
    paddingTop: 2, // 텍스트를 아이콘과 정렬
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
