// hooks/useConfirmModal.ts
import { useRef } from 'react';
import { Alert } from 'react-native';
import { CommonActions, NavigationProp } from '@react-navigation/native';
import { BoardStackParamList } from '../../../shared/page-stack/BoardPageStack';

type ConfirmModalProps = {
  navigation: NavigationProp<BoardStackParamList>
};

export const useConfirmModal = ({navigation}: ConfirmModalProps) => {
  const isNavigatingRef = useRef(false);

  const showCancelConfirmation = () => {
    if (isNavigatingRef.current) return;

    Alert.alert(
      "작성 취소",
      "변경 사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "예",
          onPress: () => {
            isNavigatingRef.current = true;
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "BoardList", params: { refresh: true } }]
              })
            );
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
