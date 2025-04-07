/**
 * 좋아요 대상의 타입을 정의하는 열거형
 * @description API 명세서와 일치하는 값으로 정의되어 있으며,
 * 백엔드 API와 프론트엔드 간의 일관성을 유지해야 합니다.
 */
export enum TargetTypeEnum {
  /** 게시글 */
  POST = "POST",

  /** 게시글 댓글 */
  POST_COMMENT = "POST_COMMENT",

  /** 청원/제안 */
  PROPOSAL = "PROPOSAL",

  /** 논쟁 의견 */
  OPINION = "OPINION",

  /** 논쟁 의견 댓글 */
  OPINION_COMMENT = "OPINION_COMMENT",
}

/**
 * 좋아요 대상 타입 (문자열 유니온 타입)
 * @description 기존 코드와의 호환성을 위해 유지
 */
export type TargetType = keyof typeof TargetTypeEnum;

/**
 * 좋아요 API 응답 타입
 * @description 백엔드 API 응답 형식과 일치해야 함
 */
export interface LikeResponse {
  /** 좋아요 대상 ID */
  targetId: number;

  /** 좋아요 대상 타입 */
  targetType: TargetType;

  /** 현재 좋아요 상태 (true: 좋아요 상태, false: 좋아요 취소 상태) */
  isLiked: boolean;

  /** 현재 좋아요 개수 */
  likeCount: number;
}

/**
 * LikeButton 컴포넌트 Props 타입
 */
export interface LikeButtonProps {
  // UI 관련 props
  /** 버튼 크기 (large: 32px, small: 24px) - 기본값: large */
  size?: "large" | "small";

  /** 수직 배치 여부 (true: 아이콘 위 텍스트 아래, false: 아이콘과 텍스트 가로 배치) - 기본값: true */
  isVertical?: boolean;

  // 기능 관련 props
  /** 좋아요 대상 ID (게시글, 댓글 등의 ID) */
  targetId?: number;

  /** 초기 좋아요 개수 - 기본값: 0 */
  initialCount?: number;

  /** 초기 좋아요 상태 - 기본값: false */
  initialLiked?: boolean;

  /** 좋아요 대상 타입 */
  targetType?: TargetType;

  /** API 호출 함수 - API 모드에서 사용 */
  apiToggleFunction?: (
    targetId: number,
    targetType: TargetType
  ) => Promise<any>;

  /** 좋아요 상태 변경 시 호출되는 콜백 함수 */
  onLikeChange?: (newState: { isLiked: boolean; likeCount: number }) => void;

  /**
   * 좋아요 버튼 클릭 시 호출되는 콜백 함수 (하위 호환성 유지)
   * @deprecated onLikeChange를 대신 사용하세요. 다음 메이저 버전에서 제거될 예정입니다.
   */
  onPress?: (isLiked: boolean) => void;

  /** 비활성화 여부 - 기본값: false */
  disabled?: boolean;

  /** 에러 발생 시 호출되는 콜백 함수 */
  onError?: (error: unknown) => string | undefined;

  /** 에러 메시지 표시 스타일 (간단/상세) - 기본값: 'simple' */
  errorDisplayMode?: "simple" | "detailed";
}
