// 게시판 네비게이션 파라미터 타입 정의
export type BoardStackParamList = {
  BoardList: { refresh?: boolean }; // 게시글 목록 화면은 별도의 파라미터가 없음 (refresh는 실시간 렌더링 시에 필요한 선택적 파라미터)
  BoardDetail: { boardId: number; refresh?: boolean; focusCommentId?: number }; // 게시글 상세 화면은 boardId를 필요로 함
  BoardWrite: { postId?: number }; // 게시글 수정 시에는 postId 참조 (작성 시에는 postId 없으므로 ? 기호로 선택적 파라미터임을 표시)
};
