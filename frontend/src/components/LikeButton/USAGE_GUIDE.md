# LikeButton 사용 가이드

LikeButton 컴포넌트는 좋아요 기능을 제공하는 재사용 가능한 UI 컴포넌트입니다. 이 가이드는 코드베이스 전체에서 일관된 방식으로 LikeButton을 사용하기 위한 가이드라인을 제공합니다.

## 기본 사용법

LikeButton을 사용하는 가장 좋은 방법은 `useLikeButton` 훅을 통해 공통 props를 생성하는 것입니다:

```tsx
import { useLikeButton } from "../../shared/hooks/useLikeButton";
import LikeButton from "../components/LikeButton/LikeButton";

// 컴포넌트 내부
const likeProps = useLikeButton(
  targetId, // 좋아요 대상 ID (필수)
  targetType, // 좋아요 대상 타입 (필수: "POST", "POST_COMMENT" 등)
  initialLiked, // 초기 좋아요 상태 (필수)
  initialCount, // 초기 좋아요 개수 (필수)
  onLikeChange // 상태 변경 시 콜백 (선택)
);

// 컴포넌트 렌더링
<LikeButton
  {...likeProps}
  size="small" // 크기: "large" | "small" (기본값: "large")
  isVertical={false} // 수직 배치 여부 (기본값: true)
  errorDisplayMode="simple" // 에러 표시 모드: "simple" | "detailed" (기본값: "simple")
/>;
```

## 상황별 사용 패턴

### 1. 게시글 목록 아이템 (BoardItem)

```tsx
// useLikeButton 훅으로 공통 props 생성
const likeProps = useLikeButton(
  post.postId,
  "POST",
  post.isLiked,
  post.likeCount
  // 목록에서는 onLikeChange 생략 가능 (성능 최적화)
);

// 렌더링
<LikeButton {...likeProps} size="small" isVertical={false} />;
```

### 2. 게시글 상세 화면 (BoardDetailScreen)

```tsx
// 좋아요 상태 변경 콜백
const handleLikeChange = ({ isLiked, likeCount }) => {
  // 게시글 상세 데이터 업데이트
  setPostData((prev) => ({
    ...prev,
    isLiked,
    likeCount,
  }));
};

// useLikeButton 훅으로 공통 props 생성
const likeProps = useLikeButton(
  postData.postId,
  "POST",
  postData.isLiked,
  postData.likeCount,
  handleLikeChange
);

// 렌더링
<LikeButton
  {...likeProps}
  size="large"
  isVertical={true}
  errorDisplayMode="detailed"
/>;
```

### 3. 댓글 아이템 (CommentItem)

```tsx
// 좋아요 상태 변경 콜백
const handleLikeChange = ({ isLiked, likeCount }) => {
  // 댓글 데이터 업데이트 (부모 컴포넌트에 전달)
  onCommentUpdate?.(comment.commentId, {
    isLiked,
    likeCount,
  });
};

// useLikeButton 훅으로 공통 props 생성
const likeProps = useLikeButton(
  comment.commentId,
  "POST_COMMENT",
  comment.isLiked,
  comment.likeCount,
  handleLikeChange
);

// 렌더링
<LikeButton {...likeProps} size="small" isVertical={false} />;
```

## UI 규칙 (일관성 유지를 위한 가이드라인)

각 상황별로 일관된 UI를 유지하기 위해 다음 규칙을 따르세요:

| 사용 위치   | 크기 (size) | 배치 (isVertical) | 에러 표시 (errorDisplayMode) |
| ----------- | ----------- | ----------------- | ---------------------------- |
| 게시글 목록 | "small"     | false             | "simple"                     |
| 게시글 상세 | "large"     | true              | "detailed"                   |
| 댓글        | "small"     | false             | "simple"                     |
| 대댓글      | "small"     | false             | "simple"                     |

## 고급 사용법

### 에러 처리 커스터마이징

특정 컴포넌트에서 에러 처리를 커스터마이징하려면:

```tsx
const likeProps = useLikeButton(/* ... */);

// 에러 처리 커스터마이징
const customProps = {
  ...likeProps,
  onError: (error) => {
    // 커스텀 에러 처리 (토스트 메시지 등)
    showToast(`좋아요 처리 중 오류가 발생했습니다: ${error.message}`);

    // 원래 에러 핸들러도 호출
    likeProps.onError(error);
  },
  errorDisplayMode: "detailed",
};

// 렌더링
<LikeButton {...customProps} size="small" isVertical={false} />;
```

### 비활성화 상태 제어

특정 조건에서 좋아요 버튼을 비활성화하려면:

```tsx
<LikeButton
  {...likeProps}
  disabled={!isLoggedIn} // 로그인하지 않은 경우 비활성화
  size="small"
/>
```

## API 서비스 레이어

LikeButton은 백엔드 API와 통합되어 있으며, 아래 서비스 레이어를 사용합니다:

```tsx
// src/shared/services/likeService.ts
import { LikeService, toggleLikeAPI } from "../../shared/services/likeService";

// 기본 사용법: toggleLikeAPI 함수 사용 (useLikeButton 훅이 사용)
const result = await toggleLikeAPI(postId, "POST");
console.log(result.data.isLiked, result.data.likeCount);

// 고급 사용법: LikeService 객체의 직접 사용
// 백엔드 API 호출
await LikeService.callToggleLikeApi(commentId, "POST_COMMENT");

// 로컬 상태 관리
const state = await LikeService.manageLocalLikeState(commentId, "POST_COMMENT");

// 상태 조회
const status = await LikeService.getLikeStatus(postId, "POST");

// 대량 상태 조회
const bulkStatus = await LikeService.getBulkLikeStatus([
  { targetId: post1.id, targetType: "POST" },
  { targetId: post2.id, targetType: "POST" },
]);

// 테스트용: 상태 초기화
await LikeService.clearLikeStatus(); // 모든 좋아요 상태 초기화
await LikeService.clearLikeStatus(postId, "POST"); // 특정 대상만 초기화
```

## 주의사항

1. **데이터 일관성**: 현재 구현에서는 백엔드 API 호출 후 로컬 상태(AsyncStorage)에서 좋아요 상태를 관리합니다. 백엔드 API는 응답 데이터를 반환하지 않으므로, 클라이언트가 상태를 계산합니다.

2. **성능 최적화**: 목록에서 많은 좋아요 버튼이 렌더링될 때는 `React.memo`와 `arePropsEqual` 함수가 성능 최적화에 도움이 됩니다. `LikeButton` 컴포넌트는 이미 이러한 최적화가 적용되어 있습니다.

3. **함수형 props**: `onLikeChange`, `onPress`, `onError` 등의 콜백 함수는 매 렌더링마다 새로 생성되므로, `React.memo`의 비교에서 제외되어 있습니다. 성능에 민감한 경우 `useCallback`으로 함수를 메모이제이션하세요.

4. **다중 기기 동기화**: 현재 구현에서는 다른 기기의 좋아요 상태가 자동으로 동기화되지 않습니다. 사용자가 다른 기기에서 좋아요를 누르면, 현재 기기에서 새로고침 전까지는 반영되지 않을 수 있습니다.

5. **AsyncStorage 사용**: 로컬 상태를 저장하기 위해 AsyncStorage를 사용합니다. React Native 환경에서 필요한 패키지이므로, 개발 환경 설정 시 `@react-native-async-storage/async-storage` 패키지가 필요합니다.
