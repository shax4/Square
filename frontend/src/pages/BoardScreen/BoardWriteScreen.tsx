import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useConfirmModal } from "./hooks/useConfirmModal";
import { BoardStackParamList } from "../../shared/page-stack/BoardPageStack";
import { usePostForm } from "../../shared/hooks";

// props 타입 정의
type Props = StackScreenProps<BoardStackParamList, "BoardWrite">;

export default function BoardWriteScreen({ route, navigation }: Props) {
  // 게시글 ID (수정 모드일 경우 존재)
  const postId = route.params?.postId;
  // 수정 모드인지 여부 확인
  const isEditMode = !!postId;

  // 취소 모달 커스텀 훅
  const { showCancelConfirmation } = useConfirmModal({
    navigation,
    isEditMode,
    postId,
  });

  // usePostForm 훅 사용
  const {
    title,
    setTitle,
    content,
    setContent,
    loading,
    submitting,
    submitError,
    createPost,
    updatePost,
    loadPost,
  } = usePostForm();

  // 수정 모드일 경우 게시글 정보 로드
  useEffect(() => {
    if (isEditMode && postId) {
      loadPost(postId);
    }
  }, [isEditMode, postId, loadPost]);

  // 성공 알림 표시 후 화면 이동 함수
  const showSuccessAlert = useCallback(
    (message: string, callback: () => void) => {
      Alert.alert("완료", message, [
        {
          text: "확인",
          onPress: callback,
        },
      ]);
    },
    []
  );

  // 게시글 저장 (생성 또는 수정)
  const handleSave = useCallback(async () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert("입력 오류", "제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("입력 오류", "내용을 입력해주세요.");
      return;
    }

    try {
      let success = false;

      if (isEditMode && postId) {
        // 게시글 수정
        success = await updatePost(postId);
        if (success) {
          // 게시글 수정 성공
          showSuccessAlert("게시글이 수정되었습니다.", () => {
            // 네비게이션 스택 재설정 (수정 화면 제거)
            navigation.reset({
              index: 1,
              routes: [
                { name: "BoardList" },
                {
                  name: "BoardDetail",
                  params: { boardId: postId, refresh: true },
                },
              ],
            });
          });
        }
      } else {
        // 새 게시글 작성
        const newPostId = await createPost();
        success = newPostId !== null;
        if (success && newPostId) {
          // 새 게시글 작성 성공
          showSuccessAlert("게시글이 작성되었습니다.", () => {
            // 목록 화면으로 이동하면서 새로고침 플래그 전달
            navigation.navigate("BoardList", { refresh: true });
          });
        }
      }

      if (!success) {
        Alert.alert(
          "오류",
          submitError?.message || "게시글을 저장하는 중 문제가 발생했습니다."
        );
      }
    } catch (error) {
      console.error("게시글 저장에 실패했습니다:", error);
      Alert.alert(
        "오류",
        error instanceof Error
          ? error.message
          : "게시글을 저장하는 중 문제가 발생했습니다."
      );
    }
  }, [
    title,
    content,
    isEditMode,
    postId,
    updatePost,
    createPost,
    submitError,
    showSuccessAlert,
    navigation,
  ]);

  // 취소 버튼에 모달 로직 연결
  const handleCancel = useCallback(() => {
    showCancelConfirmation();
  }, [showCancelConfirmation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        {/* 제목 입력 영역 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            maxLength={100} // 제목 최대 길이 제한
          />
        </View>

        {/* 내용 입력 영역 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top" // 안드로이드에서 텍스트가 상단부터 시작하도록 설정
          />
        </View>
      </ScrollView>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          disabled={loading || submitting}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            (loading || submitting) && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={loading || submitting}
        >
          <Text style={styles.saveButtonText}>
            {submitting ? "저장 중..." : isEditMode ? "수정" : "등록"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 200, // 내용 입력 필드 최소 높이
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
