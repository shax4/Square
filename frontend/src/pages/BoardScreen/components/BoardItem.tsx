import React, { memo, useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { Post } from "../../../shared/types/postTypes";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";
import Text from "../../../components/Common/Text";
import colors from "../../../../assets/colors";
import { Icons } from "../../../../assets/icons/Icons";
import { TargetType } from "../../../components/LikeButton/LikeButton.types";

interface BoardItemProps {
  item: Post;
  onPress: () => void;
}

/**
 * 게시판 목록의 각 게시글 아이템을 렌더링하는 컴포넌트
 * @param item - 게시글 데이터 객체
 * @param onPress - 게시글 클릭 시 실행될 함수
 */
function BoardItem({ item, onPress }: BoardItemProps) {
  console.log(`BoardItem 렌더링: ID ${item.postId}, 제목: ${item.title}`);

  // 필수 데이터 검증
  if (!item || !item.postId) {
    console.error("유효하지 않은 게시글 데이터:", item);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>유효하지 않은 게시글</Text>
      </View>
    );
  }

  // 게시글 내용을 미리보기 형태로 자름 (최대 100자)
  const contentPreview = item.content
    ? item.content.length > 100
      ? `${item.content.substring(0, 100)}...`
      : item.content
    : "";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7} // 터치 시 약간의 투명도 변화
    >
      {/* 작성자 정보 영역 */}
      <View style={styles.header}>
        <ProfileImage imageUrl={item.profileUrl} variant="small" />
        <View style={styles.authorInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.authorName}>{item.nickname}</Text>
            <PersonalityTag
              personality={item.userType || ""}
              nickname={item.nickname || ""}
            />
          </View>
          <Text style={styles.date}>{getTimeAgo(item.createdAt)}</Text>
        </View>
      </View>

      {/* 게시글 내용 영역 */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.content}
        </Text>
      </View>

      {/* 하단 정보 영역 (좋아요 수, 댓글 수) */}
      <View style={styles.footer}>
        <LikeButton
          targetId={item.postId}
          targetType="POST"
          initialLiked={item.isLiked ?? false}
          initialCount={item.likeCount ?? 0}
          size="small"
          isVertical={false}
        />
        <View style={styles.commentInfo}>
          <Icons.commentNew />
          <Text style={styles.commentCount}>{item.commentCount}</Text>
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
    marginLeft: 1,
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
    marginLeft: 4,
  },
  title: {
    fontSize: 17,
    marginBottom: 8,
  },
  body: {
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
  commentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  commentCount: {
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
  errorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});

export default memo(BoardItem);
