export interface ButtonProps {
  /**
   * 버튼에 표시될 텍스트
   */
  label: string;

  /**
   * 버튼이 활성/비활성 상태인지 여부
   */
  disabled?: boolean;

  /**
   * 버튼 클릭(터치) 시 실행할 함수
   */
  onPress?: () => void;

  /**
   * 스타일 변형을 위해 variant를 둘 수도 있습니다.
   * 예: "primary", "secondary", "check" 등
   */
  variant?: "primary" | "check";
}
