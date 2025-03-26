import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProfileImage from "../../../components/ProfileImage";
import LikeButton from "../../../components/LikeButton";

// 게시글 아이템 타입 정의
interface BoardItemProps {
  item: {
    postId: number;
    title: string;
    content: string;
    nickname: string;
    profileUrl?: string;
    userType: string;
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
  // 게시글 내용을 미리보기 형태로 자름 (최대 100자)
  const contentPreview =
    item.content.length > 100
      ? `${item.content.substring(0, 100)}...`
      : item.content;

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
          <Text style={styles.authorName}>{item.nickname}</Text>
          <Text style={styles.date}>{item.createdAt}</Text>
        </View>
      </View>

      {/* 게시글 내용 영역 */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>
          {contentPreview}
        </Text>
      </View>

      {/* 하단 정보 영역 (좋아요 수, 댓글 수) */}
      <View style={styles.footer}>
        <View style={styles.stats}>
          <LikeButton
            initialCount={item.likeCount}
            initialLiked={item.isLiked}
          />
          <View style={styles.commentInfo}>
            <Text style={styles.commentText}>댓글 {item.commentCount}개</Text>
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
    marginBottom: 12,
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
  },
  authorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  commentText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
});
