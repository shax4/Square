import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Icons } from '../../../../assets/icons/Icons';
import { BoardStackParamList } from '../../../shared/page-stack/BoardPageStack';
import { useConfirmModal } from '../../../pages/BoardScreen/hooks/useConfirmModal';

type CustomBackProps = {
  showConfirm?: boolean; // 확인 모달 표시 여부
  backTo?: keyof BoardStackParamList; // 특정 화면으로 이동 (선택적)
  params?: any; // 네비게이션 파라미터 (선택적)
};

export const CustomBack: React.FC<CustomBackProps> = ({ 
  showConfirm = true,
  backTo,
  params
}) => {
  const navigation = useNavigation<NavigationProp<BoardStackParamList>>();
  const { showCancelConfirmation } = useConfirmModal({ navigation });

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
    <TouchableOpacity onPress={handlePress} style={{ padding: 8 }}>
      <Icons.back />
    </TouchableOpacity>
  );
};
