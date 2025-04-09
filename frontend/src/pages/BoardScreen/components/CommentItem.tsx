import React, {
  useState,
  useCallback,
  Fragment,
  useRef,
  useEffect,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
} from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { Comment, Reply } from "../board.types";
import { Icons } from "../../../../assets/icons/Icons";
import { useAuthStore } from "../../../shared/stores/auth";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import Text from "../../../components/Common/Text";
import colors from "../../../../assets/colors";

interface CommentItemProps {
  postId: number; // 게시글 ID
  comment: Comment; // 댓글 타입 (대댓글은 재귀 호출 시 prop 이름 변경 고려)
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백
  onHideRepliesScrollRequest: (yPosition: number) => void; // *** Prop 타입 추가 ***
}

export default function CommentItem({
  postId,
  comment,
  onCommentChange,
  onHideRepliesScrollRequest, // *** Prop 받기 ***
}: CommentItemProps) {
  // *** 실제 로그인 사용자 정보 가져오기 ***
  const loggedInUser = useAuthStore((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // comment.replies는 초기 로드된 대댓글 목록
  const initialReplies = comment.replies || []; // API 응답의 초기 답글 목록
  const [displayedReplies, setDisplayedReplies] = useState<Reply[]>(() => {
    return initialReplies.slice(0, 3);
  });
  const [nextReplyCursor, setNextReplyCursor] = useState<number | null>(() => {
    if (comment.replyCount > 3 && initialReplies.length === 3) {
      return initialReplies[2].replyId;
    }
    return null;
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 더보기 로딩
  const [isReplying, setIsReplying] = useState(false); // 답글 입력창 표시 상태
  const [replyText, setReplyText] = useState(""); // 답글 내용 상태

  // *** 내용 펼치기/접기 상태 추가 ***
  const [isExpanded, setIsExpanded] = useState(false);

  // *** 모든 답글 표시 여부 상태 추가 ***
  const [isAllRepliesVisible, setIsAllRepliesVisible] = useState(
    () => comment.replyCount <= 3
  );

  // *** 레이아웃 Y 위치 상태 추가 ***
  const [commentLayoutY, setCommentLayoutY] = useState<number>(0);

  // *** 이전 답글 개수 추적 ref 추가 ***
  const prevReplyCountRef = useRef<number | undefined>(comment.replyCount);

  // *** 새 답글 추가 시 자동으로 모든 답글 로드를 위한 플래그 ref 추가 ***
  const shouldLoadAllRepliesRef = useRef(false);

  // *** 레이아웃 이벤트 핸들러 ***
  const handleLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setCommentLayoutY(y);
  };

  // *** isAuthor 로직 수정: 로그인 사용자와 댓글 작성자 비교 ***
  const isAuthor = loggedInUser?.nickname === comment.nickname;

  // useComment 훅 사용
  const {
    commentText,
    setCommentText,
    submitting,
    createComment,
    updateComment,
    deleteComment,
    loadReplies,
  } = useComment();

  // --- 댓글 내용 처리 ---
  const isLongContent = comment.content.length > 100;
  const displayedContent =
    isLongContent && !isExpanded
      ? `${comment.content.substring(0, 100)}...`
      : comment.content;

  // *** 더보기/접기 토글 함수 ***
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // *** useEffect 로직 수정: 답글 개수 변경 시 플래그 설정 ***
  useEffect(() => {
    const newInitialReplies = comment.replies || [];
    const prevReplyCount = prevReplyCountRef.current; // 이전 답글 개수 가져오기
    const currentReplyCount = comment.replyCount; // 현재 답글 개수

    const isNewReplyAdded =
      typeof prevReplyCount === "number" && currentReplyCount > prevReplyCount;

    if (isNewReplyAdded) {
      // 새 답글이 추가되었을 때는 자동 로드 플래그만 설정
      shouldLoadAllRepliesRef.current = true;
      // UI 상태는 미리 변경 (사용자에게 로딩 중임을 표시)
      setIsAllRepliesVisible(true);
    } else if (prevReplyCount === undefined) {
      // 초기 마운트 시 또는 이전 상태가 없을 때 (기본 로직)
      const slicedReplies = newInitialReplies.slice(0, 3);
      setDisplayedReplies(slicedReplies);
      let newCursor = null;
      if (currentReplyCount > 3 && newInitialReplies.length >= 3) {
        newCursor = newInitialReplies[2].replyId;
      }
      setNextReplyCursor(newCursor);
      setIsAllRepliesVisible(currentReplyCount <= 3);
    } else {
      // 답글 개수 변화 없을 때 (예: 좋아요 변경 등 다른 prop 변경)
      // 상태를 유지 (기존 displayedReplies 유지됨)
    }

    // 현재 답글 개수를 ref에 저장하여 다음 실행 시 비교
    prevReplyCountRef.current = currentReplyCount;
  }, [comment.replies, comment.replyCount]); // 의존성 배열 유지

  // *** 새로운 useEffect: 모든 답글 자동 로드 효과 ***
  useEffect(() => {
    // 플래그가 설정된 경우에만 자동 로드 실행
    if (shouldLoadAllRepliesRef.current && comment.replyCount > 3) {
      // 모든 답글 자동 로드 함수
      const loadAllReplies = async () => {
        // 플래그 초기화 (중복 실행 방지)
        shouldLoadAllRepliesRef.current = false;

        // 현재 표시된 답글의 마지막 ID가 커서가 됨
        let cursor =
          initialReplies.length >= 3 ? initialReplies[2].replyId : null;

        if (cursor) {
          setIsLoadingMore(true);
          try {
            // 재귀적으로 모든 답글 가져오기
            const allReplies = await loadAllRepliesRecursively(
              comment.commentId,
              cursor
            );

            // 초기 답글과 새로 로드한 모든 답글 합치기
            if (allReplies.length > 0) {
              setDisplayedReplies([...initialReplies, ...allReplies]);
            }

            // 모든 답글을 로드했으므로 커서를 null로 설정
            setNextReplyCursor(null);
            // 모든 답글 표시 상태로 변경
            setIsAllRepliesVisible(true);
          } catch (error) {
            console.error("자동 답글 로드 오류:", error);
            // 오류 시에도 모든 답글 표시 상태 유지 (최소한 버튼은 일관성 있게)
            setIsAllRepliesVisible(true);
          } finally {
            setIsLoadingMore(false);
          }
        } else {
          // 커서가 없는 경우 (3개 미만의 답글)
          // 이미 모든 답글이 표시되어 있으므로 상태만 업데이트
          setIsAllRepliesVisible(true);
        }
      };

      // 자동 로드 함수 실행
      loadAllReplies();
    }
  }, [comment.commentId, comment.replyCount, initialReplies, loadReplies]);

  // *** 재귀적으로 모든 답글을 가져오는 함수 추가 ***
  const loadAllRepliesRecursively = useCallback(
    async (commentId: number, cursor: number): Promise<Reply[]> => {
      try {
        const response = await loadReplies(commentId, cursor);
        if (!response || !response.replies || response.replies.length === 0) {
          return []; // 답글이 없으면 빈 배열 반환
        }

        // 응답으로 받은 답글을 Reply 타입으로 변환
        const convertToReply = (apiReply: any): Reply => ({
          replyId: apiReply.replyId,
          parentId: apiReply.parentId,
          nickname: apiReply.nickname,
          profileUrl: apiReply.profileUrl,
          userType: apiReply.userType || "",
          createdAt: apiReply.createdAt,
          content: apiReply.content,
          likeCount: apiReply.likeCount,
          isLiked: apiReply.isLiked,
        });

        const currentPageReplies = response.replies.map(convertToReply);

        // 다음 커서가 있으면 재귀적으로 더 많은 답글 로드
        if (response.nextCursorId) {
          const nextPageReplies = await loadAllRepliesRecursively(
            commentId,
            response.nextCursorId
          );
          // 현재 페이지 답글과 다음 페이지 답글 합치기
          return [...currentPageReplies, ...nextPageReplies];
        }

        // 더 이상 로드할 답글이 없으면 현재 페이지 답글만 반환
        return currentPageReplies;
      } catch (error) {
        console.error("답글 재귀 로드 중 오류:", error);
        return []; // 오류 발생 시 빈 배열 반환
      }
    },
    [loadReplies]
  );

  // *** 답글 로컬 상태 업데이트 함수 ***
  const handleReplyUpdate = useCallback((updatedReply: Reply) => {
    setDisplayedReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.replyId === updatedReply.replyId ? updatedReply : reply
      )
    );
  }, []);

  const handleReplyDelete = useCallback(
    (deletedReplyId: number) => {
      setDisplayedReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.replyId !== deletedReplyId)
      );
      onCommentChange();
    },
    [onCommentChange]
  );

  // 댓글 수정 시작 함수
  const handleEditPress = () => {
    setEditedContent(comment.content);
    setIsEditing(true);
  };
  // 댓글 수정 취소 함수
  const handleCancelPress = () => {
    setIsEditing(false);
  };
  // 댓글 수정 저장 함수
  const handleSavePress = async () => {
    if (editedContent.trim() === "" || editedContent === comment.content) {
      setIsEditing(false);
      return;
    }
    try {
      const success = await updateComment(comment.commentId, editedContent);
      if (success) {
        setIsEditing(false);
        onCommentChange();
      } else {
        Alert.alert("오류", "댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정에 실패했습니다:", error);
      Alert.alert("오류", "댓글 수정 중 오류가 발생했습니다.");
    }
  };
  // 댓글 삭제 함수
  const handleDeletePress = () => {
    Alert.alert("댓글 삭제", "정말 이 댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const success = await deleteComment(comment.commentId);
            if (success) {
              onCommentChange();
            } else {
              Alert.alert("오류", "댓글 삭제에 실패했습니다.");
            }
          } catch (error) {
            console.error("댓글 삭제에 실패했습니다:", error);
            Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };
  // 대댓글 생성 시작 함수
  const handleReplyPress = () => {
    setIsReplying(true);
    setCommentText("");
  };
  // 대댓글 생성 취소 함수
  const handleCancelReply = () => {
    setIsReplying(false);
    setCommentText("");
  };
  // 대댓글 생성 저장 함수
  const handleSubmitReply = async () => {
    try {
      const success = await createComment(postId, comment.commentId);
      if (success) {
        setIsReplying(false);
        onCommentChange(); // Triggers refresh -> useEffect
      }
    } catch (error) {
      console.error("답글 작성 핸들러 오류:", error);
      Alert.alert(
        "오류",
        "답글을 등록하는 중 예기치 못한 문제가 발생했습니다."
      );
    }
  };
  // *** handleLoadMoreReplies 함수 정의 ***
  const handleLoadMoreReplies = useCallback(async () => {
    if (isLoadingMore || nextReplyCursor === null) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const response = await loadReplies(comment.commentId, nextReplyCursor);
      if (response && response.replies && response.replies.length > 0) {
        const convertToReply = (apiReply: any): Reply => {
          return {
            replyId: apiReply.replyId,
            parentId: apiReply.parentId,
            nickname: apiReply.nickname,
            profileUrl: apiReply.profileUrl,
            userType: apiReply.userType || "",
            createdAt: apiReply.createdAt,
            content: apiReply.content,
            likeCount: apiReply.likeCount,
            isLiked: apiReply.isLiked,
          };
        };
        const newReplies = response.replies.map(convertToReply);
        setDisplayedReplies((prevReplies) => [...prevReplies, ...newReplies]);
        const nextCursor = response.nextCursorId ?? null;
        setNextReplyCursor(nextCursor);
        if (nextCursor === null) {
          setIsAllRepliesVisible(true);
        }
      } else {
        setNextReplyCursor(null);
        setIsAllRepliesVisible(true);
      }
    } catch (error) {
      console.error("❌ 답글 더보기 처리 중 오류:", error);
      Alert.alert("오류", "답글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [comment.commentId, isLoadingMore, nextReplyCursor, loadReplies]);

  // *** handleHideReplies 함수 정의 ***
  const handleHideReplies = useCallback(() => {
    const currentInitialReplies = comment.replies || [];
    setDisplayedReplies(currentInitialReplies.slice(0, 3));
    setNextReplyCursor(() => {
      if (comment.replyCount > 3 && currentInitialReplies.length >= 3) {
        return currentInitialReplies[2].replyId;
      }
      return null;
    });
    setIsAllRepliesVisible(false);
    onHideRepliesScrollRequest(commentLayoutY);
  }, [
    comment.replies,
    comment.replyCount,
    onHideRepliesScrollRequest,
    commentLayoutY,
  ]);

  // 더보기/숨기기 버튼 표시 로직
  const canLoadMore = comment.replyCount > displayedReplies.length;

  // 댓글용 좋아요 버튼 props 생성
  const commentLikeProps = useLikeButton(
    comment.commentId,
    "POST_COMMENT",
    comment.isLiked,
    comment.likeCount,
    onCommentChange
  );

  return (
    <>
      {/* 댓글 컨테이너 */}
      <View style={styles.container}>
        {/* 1. 상단 영역 (메인 내용 + 좋아요 버튼) */}
        <View style={styles.topContainer}>
          {/* 1-1. 메인 내용 블록 (사용자 정보 + 댓글 내용/수정) */}
          <View style={styles.mainContentBlock}>
            {/* 사용자 정보 */}
            <View style={styles.userInfoContainer}>
              <ProfileImage imageUrl={comment.profileUrl} variant="small" />
              <View style={styles.userInfoText}>
                <Text style={styles.nickname}>{comment.nickname}</Text>
                <PersonalityTag
                  personality={comment.userType}
                  nickname={comment.nickname}
                />
              </View>
              {/* 시간은 푸터로 이동 */}
            </View>

            {/* 댓글 내용 또는 수정 UI */}
            {isEditing ? (
              <View style={styles.editContainer}>
                {/* TextInput 및 저장/취소 버튼 (이전과 동일) */}
                <TextInput
                  style={styles.textInput}
                  value={editedContent}
                  onChangeText={setEditedContent}
                  autoFocus={true}
                  multiline={true}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleCancelPress}
                    style={styles.button}
                  >
                    <Text weight="medium">취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSavePress}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text weight="medium" style={styles.saveButtonText}>
                      저장
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.contentRow}>
                <Text weight="medium" style={styles.contentText}>
                  {comment.content}
                </Text>
                {/* 좋아요 버튼 - 내용 안에 배치 */}
                <View style={styles.replyLikeContainer}>
                  <LikeButton
                    {...commentLikeProps}
                    size="small"
                    isVertical={false}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 2. 하단 푸터 영역 (시간/답글 + 수정/삭제) */}
        <View style={styles.footerContainer}>
          {/* 2-1. 왼쪽 그룹 (시간 + 답글 달기) */}
          <View style={styles.leftFooterGroup}>
            <Text weight="medium" style={styles.time}>
              {getTimeAgo(comment.createdAt)}
            </Text>
            {/* 답글 달기 버튼 */}
            {!isEditing && ( // 수정 중 아닐 때만 표시
              <TouchableOpacity onPress={handleReplyPress}>
                <Text weight="medium" style={styles.replyButtonText}>
                  답글 달기
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 2-2. 오른쪽 그룹 (수정/삭제 버튼) */}
          {isAuthor && !isEditing && (
            <View style={styles.authorButtons}>
              <TouchableOpacity onPress={handleEditPress}>
                <Text weight="medium" style={styles.actionText}>
                  수정
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletePress}>
                <Text weight="medium" style={styles.actionText}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 답글 입력창 (isReplying 상태에 따라 표시) */}
        {isReplying && (
          <View style={styles.replyInputArea}>
            <TextInput
              style={styles.replyInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder={`${comment.nickname}에게 답글 달기...`}
              autoFocus={true}
              multiline={true}
            />
            <View style={styles.replyButtonContainer}>
              <TouchableOpacity
                onPress={handleCancelReply}
                style={styles.button}
                disabled={submitting}
              >
                <Text weight="medium">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitReply}
                style={[
                  styles.button,
                  styles.saveButton,
                  submitting && styles.disabledButton,
                ]}
                disabled={submitting || !commentText.trim()}
              >
                <Text weight="medium" style={styles.saveButtonText}>
                  등록
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 대댓글들을 별도의 독립 컨테이너로 렌더링 */}
      {loadedReplies &&
        loadedReplies.length > 0 &&
        loadedReplies.map((reply) => (
          <View key={`reply-${reply.replyId}`} style={styles.replyItem}>
            {/* 프로필 정보 */}
            <View style={styles.userInfoContainer}>
              <ProfileImage imageUrl={reply.profileUrl} variant="small" />
              <View style={styles.userInfoText}>
                <Text style={styles.nickname}>{reply.nickname}</Text>
                <PersonalityTag
                  personality={reply.userType}
                  nickname={reply.nickname}
                />
              </View>
            </View>

            {/* 대댓글 내용 - 수정 중이면 수정 UI 표시 */}
            {editingReplyId === reply.commentId ? (
              // 대댓글 수정 모드 UI
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.textInput}
                  value={editedReplyContent}
                  onChangeText={setEditedReplyContent}
                  autoFocus={true}
                  multiline={true}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleCancelEditReply}
                    style={styles.button}
                  >
                    <Text weight="medium">취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSaveReply(reply.commentId)}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text weight="medium" style={styles.saveButtonText}>
                      저장
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // 대댓글 일반 모드 UI
              <Fragment>
                <View style={styles.replyContentRow}>
                  <Text weight="medium" style={styles.contentText}>
                    {reply.content}
                  </Text>
                  <View style={styles.replyLikeContainer}>
                    <LikeButton
                      {...getReplyLikeProps(reply)}
                      size="small"
                      isVertical={false}
                    />
                  </View>
                </View>
              </Fragment>
            )}

            {/* 푸터는 수정 중이 아닐 때만 표시 */}
            {editingReplyId !== reply.commentId && (
              <View style={styles.replyFooterContainer}>
                <Text weight="medium" style={styles.time}>
                  {getTimeAgo(reply.createdAt)}
                </Text>

                {user?.nickname === reply.nickname && (
                  <View style={styles.authorButtons}>
                    <TouchableOpacity onPress={() => handleEditReply(reply)}>
                      <Text weight="medium" style={styles.actionText}>
                        수정
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteReply(reply.commentId)}
                    >
                      <Text weight="medium" style={styles.actionText}>
                        삭제
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

      {/* 더보기 버튼 */}
      {hasMoreReplies && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMoreReplies}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? (
            <ActivityIndicator size="small" color="#888" />
          ) : (
            <Text weight="medium" style={styles.loadMoreText}>
              답글 {comment.replyCount - loadedReplies.length}개 더보기
            </Text>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// --- 스타일 정의 (수정) ---
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    // backgroundColor: "#fafafa", // 배경색 통일
    // marginBottom: 8, // 댓글 간 간격 추가
    // borderRadius: 8, // 모서리 둥글게
    // borderWidth: 1, // 테두리 추가
    // borderColor: "#eeeeee", // 테두리 색상
  },
  replyItemContainer: {
    // 대댓글 컨테이너 (독립적 컨테이너)
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: "#fafafa", // 댓글과 같은 배경색
    marginBottom: 2, // 간격 추가
    // borderRadius: 8, // 모서리 둥글게
    // borderWidth: 1, // 테두리 추가
    // borderColor: "#eeeeee", // 테두리 색상
    marginLeft: 30, // 들여쓰기
    // borderLeftWidth: 3, // 왼쪽 경계선
    // borderLeftColor: "#e0e0e0", // 경계선 색상
  },
  topContainer: {
    // 상단 영역: 내용 블록과 좋아요 버튼을 가로로 배치
    flexDirection: "row",
    alignItems: "center", // 좋아요 버튼 세로 중앙 정렬
    marginBottom: 8, // 상단 영역과 푸터 영역 사이 간격
  },
  mainContentBlock: {
    // 사용자 정보 + 댓글 내용/수정 영역
    flex: 1, // 가능한 공간 모두 차지하여 좋아요 버튼을 오른쪽으로 밀어냄
    marginRight: 12, // 좋아요 버튼과의 간격
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorInfo: {
    marginLeft: 8,
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  nickname: {
    marginRight: 6,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2, // 사용자 정보 바로 아래부터 시작
  },
  editingContainer: {
    marginLeft: 40, // 들여쓰기
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff", // 입력창 배경색 유지
  },
  buttonContainer: { flexDirection: "row", justifyContent: "flex-end" },
  button: {
    padding: 8,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: colors.yesDark,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "white",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between", // 왼쪽 그룹과 오른쪽 그룹을 양 끝으로
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 40, // 들여쓰기
  },
  replyButtonText: {
    fontSize: 12,
    color: "#555", // 약간 더 진하게
  },
  authorButtons: {
    // 수정 + 삭제 버튼 그룹
    flexDirection: "row",
  },
  actionText: {
    fontSize: 12,
    color: "#555",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    marginLeft: 2,
  },
  replyFooterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  loadMoreButton: {
    padding: 8,
    alignItems: "center",
    marginBottom: 6, // 간격 추가
    marginLeft: 24, // 들여쓰기 적용
  },
  loadMoreText: {
    color: "#666",
    fontSize: 14,
  },
  replyInputArea: {
    marginTop: 12, // 간격 증가
    backgroundColor: "#f8f8f8", // 입력창 영역 배경색
    padding: 8, // 패딩 추가
    borderRadius: 8, // 모서리 둥글게
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    marginLeft: 2,
  },
  // *** 비활성화 버튼 스타일 추가 ***
  disabledButton: {
    backgroundColor: "#aaa", // 비활성 버튼 색상
  },
  // *** 버튼 텍스트 스타일 추가 ***
  buttonText: {
    color: "#fff", // 버튼 텍스트 색상
    fontWeight: "bold",
    fontSize: 13,
  },
});
