import { useRef } from 'react';
import { Alert } from 'react-native';
import { CommonActions, NavigationProp } from '@react-navigation/native';
import { BoardStackParamList } from '../../../shared/page-stack/BoardPageStack';

type ConfirmModalProps = {
  navigation: NavigationProp<BoardStackParamList>;
  isEditMode?: boolean; // 수정 모드 여부
  postId?: number; // 수정 중인 게시글 ID
};

export const useConfirmModal = ({navigation, isEditMode, postId}: ConfirmModalProps) => {
  const isNavigatingRef = useRef(false);

  const showCancelConfirmation = () => {
    if (isNavigatingRef.current) return;

    Alert.alert(
      isEditMode ? "수정 취소" : "작성 취소",
      isEditMode 
        ? "수정 사항이 저장되지 않습니다. 취소하시겠습니까?"
        : "작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "예",
          onPress: () => {
            isNavigatingRef.current = true;
            if (isEditMode && postId) {
              // 수정 모드일 경우 게시글 상세 페이지로 이동
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: "BoardList" },
                    { name: "BoardDetail", params: { boardId: postId } }
                  ]
                })
              );
            } else {
              // 작성 모드일 경우 게시글 목록으로 이동 (기존 로직 유지)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "BoardList", params: { refresh: true } }]
                })
              );
            }
          }
        }
      ]
    );
  };

  return {
    showCancelConfirmation,
    isNavigatingRef
  };
};