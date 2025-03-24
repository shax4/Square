import { KeyboardTypeOptions } from 'react-native';

export enum TextFieldVariant {
  Default = 'default',
  Multiline = 'multiline'
}

export interface TextFieldProps {
  /**
   * 입력 필드 위에 표시될 라벨
   */
  label?: string;
  
  /**
   * 입력 필드의 현재 값
   */
  value: string;
  
  /**
   * 텍스트 변경 시 호출될 함수
   */
  onChangeText: (text: string) => void;
  
  /**
   * 입력 필드가 비어있을 때 표시될 텍스트
   */
  placeholder?: string;
  
  /**
   * 키보드 타입 (예: 'default', 'email-address', 'numeric')
   */
  keyboardType?: KeyboardTypeOptions;
  
  /**
   * 비밀번호 입력 여부 (입력 텍스트를 ****로 표시)
   */
  secureTextEntry?: boolean;
  
  /**
   * 입력 필드 활성/비활성 상태
   */
  disabled?: boolean;
  
  /**
   * 오류 메시지 (있을 경우 오류 스타일 적용)
   */
  error?: string;
  
  /**
   * 스타일 변형
   */
  variant?: TextFieldVariant;

  /**
   * 가이드 텍스트 추가
   */
  guide?: string;
}