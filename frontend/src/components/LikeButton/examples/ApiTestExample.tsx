import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LikeButton from "../LikeButton";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import { LikeService } from "../../../shared/services/likeService";

/**
 * API 연동 테스트를 위한 예제 컴포넌트
 * 실제 백엔드 API에 연결하여 좋아요 기능을 테스트합니다.
 */
const LikeButtonApiTestExample = () => {
  // 테스트할 게시글/댓글 ID (실제 백엔드에 존재하는 ID 사용)
  const testPostId = 1; // 테스트용 게시글 ID
  const testCommentId = 1; // 테스트용 댓글 ID

  // 좋아요 상태 (백엔드에서 초기 상태 가져옴)
  const [postLikeState, setPostLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [commentLikeState, setCommentLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 좋아요 상태 가져오기
  useEffect(() => {
    const fetchInitialLikeStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // 게시글과 댓글의 좋아요 상태를 한 번에 조회
        const results = await LikeService.getBulkLikeStatus([
          { targetId: testPostId, targetType: "POST" },
          { targetId: testCommentId, targetType: "POST_COMMENT" },
        ]);

        // 응답 데이터가 있으면 상태 업데이트
        if (results.length > 0) {
          const postData = results.find(
            (item) => item.targetId === testPostId && item.targetType === "POST"
          );

          const commentData = results.find(
            (item) =>
              item.targetId === testCommentId &&
              item.targetType === "POST_COMMENT"
          );

          if (postData) {
            setPostLikeState({
              isLiked: postData.isLiked,
              likeCount: postData.likeCount,
            });
          }

          if (commentData) {
            setCommentLikeState({
              isLiked: commentData.isLiked,
              likeCount: commentData.likeCount,
            });
          }
        }
      } catch (err) {
        console.error("좋아요 초기 상태 조회 실패:", err);
        setError("좋아요 상태를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLikeStatus();
  }, []);

  // useLikeButton 훅을 사용하여 좋아요 버튼 속성 생성
  const postLikeProps = useLikeButton(
    testPostId,
    "POST",
    postLikeState.isLiked,
    postLikeState.likeCount,
    (newState) => setPostLikeState(newState)
  );

  const commentLikeProps = useLikeButton(
    testCommentId,
    "POST_COMMENT",
    commentLikeState.isLiked,
    commentLikeState.likeCount,
    (newState) => setCommentLikeState(newState)
  );

  // 상태 초기화 함수
  const handleReset = async () => {
    try {
      setLoading(true);
      await fetchInitialLikeStatus();
    } catch (err) {
      console.error("상태 초기화 실패:", err);
      setError("상태 초기화에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 좋아요 상태를 다시 가져오는 함수
  const fetchInitialLikeStatus = async () => {
    try {
      // 게시글 좋아요 상태 조회
      const postStatus = await LikeService.getLikeStatus(testPostId, "POST");
      setPostLikeState({
        isLiked: postStatus.isLiked,
        likeCount: postStatus.likeCount,
      });

      // 댓글 좋아요 상태 조회
      const commentStatus = await LikeService.getLikeStatus(
        testCommentId,
        "POST_COMMENT"
      );
      setCommentLikeState({
        isLiked: commentStatus.isLiked,
        likeCount: commentStatus.likeCount,
      });

      setError(null);
    } catch (err) {
      console.error("좋아요 상태 조회 실패:", err);
      setError("좋아요 상태를 불러오는데 실패했습니다.");
      throw err;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>좋아요 API 연동 테스트</Text>

      {loading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>게시글 좋아요 테스트</Text>
            <Text style={styles.description}>
              게시글 ID: {testPostId}, 상태:{" "}
              {postLikeState.isLiked ? "좋아요 됨" : "좋아요 안됨"}, 개수:{" "}
              {postLikeState.likeCount}
            </Text>

            <View style={styles.buttonContainer}>
              <Text style={styles.label}>Large 수직 버튼:</Text>
              <LikeButton
                {...postLikeProps}
                size="large"
                isVertical={true}
                errorDisplayMode="detailed"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.label}>Small 수평 버튼:</Text>
              <LikeButton {...postLikeProps} size="small" isVertical={false} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>댓글 좋아요 테스트</Text>
            <Text style={styles.description}>
              댓글 ID: {testCommentId}, 상태:{" "}
              {commentLikeState.isLiked ? "좋아요 됨" : "좋아요 안됨"}, 개수:{" "}
              {commentLikeState.likeCount}
            </Text>

            <View style={styles.buttonContainer}>
              <Text style={styles.label}>Small 수평 버튼:</Text>
              <LikeButton
                {...commentLikeProps}
                size="small"
                isVertical={false}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>상태 초기화</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  testSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginRight: 12,
    width: 120,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  resetButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LikeButtonApiTestExample;
