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
import { TargetType } from "../LikeButton.types";

/**
 * API 연동 테스트를 위한 예제 컴포넌트
 * 백엔드 API와 AsyncStorage를 통합적으로 활용한 좋아요 기능을 테스트합니다.
 *
 * - 테스트 범위:
 *   1. 게시글/댓글에 대한 좋아요 토글 기능
 *   2. 초기 상태 로드 (AsyncStorage)
 *   3. 에러 처리 및 UI 표시
 *   4. 상태 동기화 테스트
 */
const LikeButtonApiTestExample = () => {
  // 테스트할 대상 ID (실제 백엔드에 존재하는 ID 사용)
  const testPostId = 1; // 게시글 ID
  const testCommentId = 1; // 댓글 ID
  const testProposalId = 1; // 청원 ID
  const testOpinionId = 1; // 논쟁 의견 ID
  const testOpinionCommentId = 1; // 논쟁 의견 댓글 ID

  // 테스트할 대상 타입
  const postType: TargetType = "POST";
  const commentType: TargetType = "POST_COMMENT";
  const proposalType: TargetType = "PROPOSAL";
  const opinionType: TargetType = "OPINION";
  const opinionCommentType: TargetType = "OPINION_COMMENT";

  // 좋아요 상태 (AsyncStorage에서 초기 상태 가져옴)
  const [postLikeState, setPostLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [commentLikeState, setCommentLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [proposalLikeState, setProposalLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [opinionLikeState, setOpinionLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [opinionCommentLikeState, setOpinionCommentLikeState] = useState({
    isLiked: false,
    likeCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 좋아요 상태 가져오기
  useEffect(() => {
    fetchInitialLikeStatus();
  }, []);

  // 초기 좋아요 상태를 다시 가져오는 함수
  const fetchInitialLikeStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // 모든 대상의 좋아요 상태를 한 번에 조회 (배치 처리)
      const results = await LikeService.getBulkLikeStatus([
        { targetId: testPostId, targetType: postType },
        { targetId: testCommentId, targetType: commentType },
        { targetId: testProposalId, targetType: proposalType },
        { targetId: testOpinionId, targetType: opinionType },
        { targetId: testOpinionCommentId, targetType: opinionCommentType },
      ]);

      // 응답 데이터가 있으면 상태 업데이트
      if (results.length > 0) {
        // 게시글 데이터 처리
        const postData = results.find(
          (item) => item.targetId === testPostId && item.targetType === postType
        );
        if (postData) {
          setPostLikeState({
            isLiked: postData.isLiked,
            likeCount: postData.likeCount,
          });
        }

        // 댓글 데이터 처리
        const commentData = results.find(
          (item) =>
            item.targetId === testCommentId && item.targetType === commentType
        );
        if (commentData) {
          setCommentLikeState({
            isLiked: commentData.isLiked,
            likeCount: commentData.likeCount,
          });
        }

        // 청원 데이터 처리
        const proposalData = results.find(
          (item) =>
            item.targetId === testProposalId && item.targetType === proposalType
        );
        if (proposalData) {
          setProposalLikeState({
            isLiked: proposalData.isLiked,
            likeCount: proposalData.likeCount,
          });
        }

        // 논쟁 의견 데이터 처리
        const opinionData = results.find(
          (item) =>
            item.targetId === testOpinionId && item.targetType === opinionType
        );
        if (opinionData) {
          setOpinionLikeState({
            isLiked: opinionData.isLiked,
            likeCount: opinionData.likeCount,
          });
        }

        // 논쟁 의견 댓글 데이터 처리
        const opinionCommentData = results.find(
          (item) =>
            item.targetId === testOpinionCommentId &&
            item.targetType === opinionCommentType
        );
        if (opinionCommentData) {
          setOpinionCommentLikeState({
            isLiked: opinionCommentData.isLiked,
            likeCount: opinionCommentData.likeCount,
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

  // useLikeButton 훅을 사용하여 좋아요 버튼 속성 생성
  const postLikeProps = useLikeButton(
    testPostId,
    postType,
    postLikeState.isLiked,
    postLikeState.likeCount,
    (newState) => setPostLikeState(newState)
  );

  const commentLikeProps = useLikeButton(
    testCommentId,
    commentType,
    commentLikeState.isLiked,
    commentLikeState.likeCount,
    (newState) => setCommentLikeState(newState)
  );

  const proposalLikeProps = useLikeButton(
    testProposalId,
    proposalType,
    proposalLikeState.isLiked,
    proposalLikeState.likeCount,
    (newState) => setProposalLikeState(newState)
  );

  const opinionLikeProps = useLikeButton(
    testOpinionId,
    opinionType,
    opinionLikeState.isLiked,
    opinionLikeState.likeCount,
    (newState) => setOpinionLikeState(newState)
  );

  const opinionCommentLikeProps = useLikeButton(
    testOpinionCommentId,
    opinionCommentType,
    opinionCommentLikeState.isLiked,
    opinionCommentLikeState.likeCount,
    (newState) => setOpinionCommentLikeState(newState)
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

  // 특정 항목만 초기화하는 함수
  const clearSpecificItem = async (
    targetId: number,
    targetType: TargetType,
    label: string
  ) => {
    try {
      setLoading(true);
      await LikeService.clearLikeStatus(targetId, targetType);
      await fetchInitialLikeStatus();
      console.log(`${label} 좋아요 상태가 초기화되었습니다.`);
    } catch (err) {
      console.error(`${label} 상태 초기화 실패:`, err);
      setError(`${label} 상태 초기화에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  // 수동으로 좋아요 상태 변경하는 함수 (테스트용)
  const manuallyToggleLike = async (
    targetId: number,
    targetType: TargetType
  ) => {
    try {
      await LikeService.manageLocalLikeState(targetId, targetType);
      await fetchInitialLikeStatus();
    } catch (err) {
      console.error("수동 토글 실패:", err);
      setError("좋아요 상태 변경에 실패했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>좋아요 API 연동 테스트</Text>
      <Text style={styles.subtitle}>백엔드 API + AsyncStorage 통합 테스트</Text>

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

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => clearSpecificItem(testPostId, postType, "게시글")}
            >
              <Text style={styles.resetButtonText}>게시글 좋아요 초기화</Text>
            </TouchableOpacity>
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

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() =>
                clearSpecificItem(testCommentId, commentType, "댓글")
              }
            >
              <Text style={styles.resetButtonText}>댓글 좋아요 초기화</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* 청원(PROPOSAL) 테스트 섹션 */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>청원 좋아요 테스트</Text>
            <Text style={styles.description}>
              청원 ID: {testProposalId}, 상태:{" "}
              {proposalLikeState.isLiked ? "좋아요 됨" : "좋아요 안됨"}, 개수:{" "}
              {proposalLikeState.likeCount}
            </Text>

            <View style={styles.buttonContainer}>
              <Text style={styles.label}>Large 수직 버튼:</Text>
              <LikeButton
                {...proposalLikeProps}
                size="large"
                isVertical={true}
                errorDisplayMode="detailed"
              />
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() =>
                clearSpecificItem(testProposalId, proposalType, "청원")
              }
            >
              <Text style={styles.resetButtonText}>청원 좋아요 초기화</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* 논쟁 의견(OPINION) 테스트 섹션 */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>논쟁 의견 좋아요 테스트</Text>
            <Text style={styles.description}>
              의견 ID: {testOpinionId}, 상태:{" "}
              {opinionLikeState.isLiked ? "좋아요 됨" : "좋아요 안됨"}, 개수:{" "}
              {opinionLikeState.likeCount}
            </Text>

            <View style={styles.buttonContainer}>
              <Text style={styles.label}>Small 수평 버튼:</Text>
              <LikeButton
                {...opinionLikeProps}
                size="small"
                isVertical={false}
              />
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() =>
                clearSpecificItem(testOpinionId, opinionType, "논쟁 의견")
              }
            >
              <Text style={styles.resetButtonText}>
                논쟁 의견 좋아요 초기화
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* 논쟁 의견 댓글(OPINION_COMMENT) 테스트 섹션 */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>
              논쟁 의견 댓글 좋아요 테스트
            </Text>
            <Text style={styles.description}>
              의견 댓글 ID: {testOpinionCommentId}, 상태:{" "}
              {opinionCommentLikeState.isLiked ? "좋아요 됨" : "좋아요 안됨"},
              개수: {opinionCommentLikeState.likeCount}
            </Text>

            <View style={styles.buttonContainer}>
              <Text style={styles.label}>Small 수평 버튼:</Text>
              <LikeButton
                {...opinionCommentLikeProps}
                size="small"
                isVertical={false}
              />
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() =>
                clearSpecificItem(
                  testOpinionCommentId,
                  opinionCommentType,
                  "논쟁 의견 댓글"
                )
              }
            >
              <Text style={styles.resetButtonText}>
                논쟁 의견 댓글 좋아요 초기화
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>고급 테스트 옵션</Text>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: "#f44336" }]}
              onPress={async () => {
                try {
                  setLoading(true);
                  // 모든 좋아요 상태 초기화
                  await LikeService.clearLikeStatus();
                  // 테스트 상태 다시 불러오기
                  await fetchInitialLikeStatus();
                } catch (err) {
                  console.error("상태 초기화 실패:", err);
                  setError("상태 초기화에 실패했습니다.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text style={styles.resetButtonText}>
                모든 좋아요 상태 초기화
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: "#2196F3" }]}
              onPress={() => manuallyToggleLike(testPostId, postType)}
            >
              <Text style={styles.resetButtonText}>
                게시글 좋아요 수동 토글
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: "#2196F3" }]}
              onPress={() => manuallyToggleLike(testCommentId, commentType)}
            >
              <Text style={styles.resetButtonText}>댓글 좋아요 수동 토글</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: "#2196F3" }]}
              onPress={() => manuallyToggleLike(testProposalId, proposalType)}
            >
              <Text style={styles.resetButtonText}>청원 좋아요 수동 토글</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: "#2196F3" }]}
              onPress={() => manuallyToggleLike(testOpinionId, opinionType)}
            >
              <Text style={styles.resetButtonText}>
                논쟁 의견 좋아요 수동 토글
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: "#2196F3" }]}
              onPress={() =>
                manuallyToggleLike(testOpinionCommentId, opinionCommentType)
              }
            >
              <Text style={styles.resetButtonText}>
                논쟁 의견 댓글 좋아요 수동 토글
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
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
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 10,
  },
  testSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    marginRight: 10,
    width: 100,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 5,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default LikeButtonApiTestExample;
