import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Icons } from '../../../../assets/icons/Icons';
import { BoardStackParamList } from '../../../shared/page-stack/BoardPageStack';
import { useConfirmModal } from '../../../pages/BoardScreen/hooks/useConfirmModal';

type CustomBackProps = {
  showConfirm?: boolean; // 확인 모달 표시 여부
  backTo?: keyof BoardStackParamList; // 특정 화면으로 이동
  params?: any; // 네비게이션 파라미터
  isEditMode?: boolean; // 수정 모드 여부
  postId?: number; // 수정 중인 게시글 ID
};

export const CustomBack: React.FC<CustomBackProps> = ({ 
  showConfirm = true,
  backTo,
  params,
  isEditMode,
  postId
}) => {
  const navigation = useNavigation<NavigationProp<BoardStackParamList>>();
  const { showCancelConfirmation } = useConfirmModal({ navigation, isEditMode, postId });

  const handlePress = () => {
    if (showConfirm) {
      // 확인 모달 표시
      showCancelConfirmation();
    } else if (backTo) {
      // 특정 화면으로 이동
      navigation.navigate(backTo, params);
    } else {
      // 기본 뒤로가기
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 24, alignContent: 'center', justifyContent: 'center' }}>
      <Icons.back />
    </TouchableOpacity>
  );
};
