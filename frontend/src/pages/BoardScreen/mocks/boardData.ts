import { Post, Reply } from "../board.types";

// 랜덤 userType 생성 함수 (P/I, N/C, T/S, B/R 조합)
const getRandomUserType = () => {
  const first = Math.random() < 0.5 ? "P" : "I";
  const second = Math.random() < 0.5 ? "N" : "C";
  const third = Math.random() < 0.5 ? "T" : "S";
  const fourth = Math.random() < 0.5 ? "B" : "R";
  return first + second + third + fourth;
};

// 기준 날짜: 2025-04-10
const baseDate = new Date("2025-04-10T00:00:00Z");

// minDays~maxDays 범위내의 랜덤 날짜 생성 함수
const getRandomDate = (minDays: number, maxDays: number): string => {
  // 범위를 1~14일로 제한
  const min = Math.max(1, Math.min(minDays, 14));
  const max = Math.max(1, Math.min(maxDays, 14));

  // 랜덤 일수 계산 (min~max 사이)
  const randomDays = Math.floor(Math.random() * (max - min + 1)) + min;

  // 기준 날짜에서 randomDays만큼 이전 날짜 계산
  const date = new Date(baseDate);
  date.setDate(date.getDate() - randomDays);

  return date.toISOString();
};

// 현재 사용자 정보
export const currentUser = {
  id: 1,
  nickname: "반짝이는하마",
  profileUrl: "https://picsum.photos/id/1012/50/50",
  userType: getRandomUserType(),
};

// 게시글 목 데이터
export const mockPosts: Post[] = [
  // 사용자 본인이 작성한 글
  {
    postId: 1,
    nickname: currentUser.nickname,
    profileUrl: currentUser.profileUrl,
    userType: currentUser.userType,
    createdAt: getRandomDate(9, 14), // 9~14일 전
    title: "등산 초보자가 도전해볼만한 산 추천해주세요!",
    content:
      "안녕하세요, 최근에 등산에 관심이 생겨서 시작해보려고 합니다. 서울 근교에 초보자가 도전해볼만한 산이 있을까요? 체력은 그렇게 좋지 않지만, 경치가 좋고 코스가 잘 정비된 곳으로 추천 부탁드립니다. 등산화는 이미 구입했고, 필수 장비나 주의사항도 알려주시면 감사하겠습니다. 주말에 친구들과 함께 가볼 예정입니다.",
    likeCount: 42,
    commentCount: 4,
    isLiked: false,
    isScrapped: true,
    comments: [
      {
        commentId: 101,
        parentId: undefined, // 최상위 댓글
        nickname: "자연사랑꾼",
        profileUrl: "https://picsum.photos/id/1025/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(5, 7), // 5~7일 전 (게시글보다 나중)
        content:
          "초보자라면 북한산 둘레길이나 관악산 기본 코스가 좋을 것 같아요. 특히 북한산 둘레길은 경사가 심하지 않고 경치도 좋아서 처음 시작하시는 분들께 인기가 많답니다. 물은 충분히 챙기시고, 간식도 몇 개 준비하세요!",
        likeCount: 28,
        isLiked: true,
        replyCount: 5, // 실제 총 대댓글 개수
        // 초기 로드 시 보여줄 대댓글 (예시: 3개만)
        replies: [
          {
            commentId: 201,
            parentId: 101,
            nickname: "등산마스터",
            profileUrl: "https://picsum.photos/id/1027/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(3, 4), // 3~4일 전 (댓글보다 나중)
            content:
              "북한산 둘레길 중에서도 1-3구간이 제일 무난하고 좋아요. 초보자에게 딱이죠. 지하철로도 접근성이 좋아서 차가 없으신 분들도 쉽게 다녀오실 수 있습니다.",
            likeCount: 15,
            isLiked: false,
          },
          {
            commentId: 202,
            parentId: 101,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: getRandomDate(2, 3), // 2~3일 전
            content:
              "북한산 둘레길 정보 감사합니다! 혹시 소요 시간은 대략 어느 정도인가요? 오전에 가서 점심 먹고 오후에 내려올 생각인데 시간 계획을 어떻게 짜야 할지 고민이에요.",
            likeCount: 7,
            isLiked: true,
          },
          {
            commentId: 203,
            parentId: 101,
            nickname: "트레킹러버",
            profileUrl: "https://picsum.photos/id/1035/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "관악산도 좋지만 저는 청계산도 추천드려요! 대중교통으로 접근하기 쉽고 난이도도 적당해서 초보자분들에게 인기가 많아요. 특히 맨발공원 코스는 숲이 우거져서 여름에도 시원합니다.",
            likeCount: 12,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 102,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: getRandomDate(5, 6), // 5~6일 전
        content:
          "여러분 모두 감사합니다! 좋은 정보들 덕분에 이번 주말에 북한산 둘레길로 첫 등산을 도전해볼게요. 등산화랑 작은 배낭은 준비했는데, 혹시 챙겨가면 좋을 다른 물품이 있을까요?",
        likeCount: 18,
        isLiked: false,
        replyCount: 2,
        replies: [
          {
            commentId: 204,
            parentId: 102,
            nickname: "야외활동가",
            profileUrl: "https://picsum.photos/id/1036/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(3, 4), // 3~4일 전
            content:
              "모자나 선글라스도 필수입니다! 햇빛이 강하면 금방 지치거든요. 또 간단한 구급약품(밴드, 물티슈 등)과 단백질바 같은 에너지 보충 간식도 있으면 좋아요. 즐거운 등산 되세요!",
            likeCount: 14,
            isLiked: true,
          },
          {
            commentId: 205,
            parentId: 102,
            nickname: "산사랑꾼",
            profileUrl: "https://picsum.photos/id/1038/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "등산스틱도 있으면 좋아요. 처음엔 없어도 괜찮지만 나중에 더 높은 산 가실 때 무릎 보호에 정말 도움됩니다. 첫 등산 즐겁게 다녀오세요!",
            likeCount: 9,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 103,
        parentId: undefined,
        nickname: "주말하이커",
        profileUrl: "https://picsum.photos/id/1054/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(4, 5), // 4~5일 전
        content:
          "남산도 도시 한가운데 있지만 의외로 괜찮은 코스예요. 처음 등산 입문하시는 분들은 서울 근교의 낮은 산부터 시작해서 조금씩 높은 산으로 도전해보는 게 좋습니다. 그리고 날씨 확인은 필수예요!",
        likeCount: 21,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
      {
        commentId: 104,
        parentId: undefined,
        nickname: "산악대장",
        profileUrl: "https://picsum.photos/id/1058/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(3, 4), // 3~4일 전
        content:
          "도봉산도 초보자가 도전하기 좋은 산이에요. 다양한 코스가 있어서 자신의 체력에 맞게 선택할 수 있고, 정상에서 보는 서울 전경이 정말 멋집니다. 인왕산도 짧지만 서울 도심 전망이 환상적이에요. 즐거운 등산 되세요!",
        likeCount: 32,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 다른 사용자가 작성한 글 1
  {
    postId: 2,
    nickname: "맛있는하루",
    profileUrl: "https://picsum.photos/id/102/50/50",
    userType: getRandomUserType(),
    createdAt: getRandomDate(6, 12), // 6~12일 전
    title: "처음 만든 홈베이킹, 성공했어요!",
    content:
      "평소 베이킹에 관심이 많았지만 도전할 용기가 없었는데, 드디어 첫 쿠키 베이킹에 성공했습니다! 초코칩 쿠키를 만들었는데 생각보다 쉽더라고요. 재료 계량만 정확히 하면 되는 것 같아요. 다음에는 마카롱에 도전해볼 예정인데, 초보자를 위한 팁이나 레시피 있으면 공유해주세요. 특히 마카롱은 까다롭다고 하던데 실패하지 않는 비법이 있을까요?",
    likeCount: 67,
    commentCount: 3,
    isLiked: true,
    isScrapped: false,
    comments: [
      {
        commentId: 105,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: getRandomDate(4, 5), // 4~5일 전
        content:
          "와 정말 맛있어 보여요! 저도 베이킹에 관심이 많은데, 아직 도전해본 적이 없어요. 혹시 초보자가 시작하기 좋은 베이킹 추천해주실 수 있나요? 쿠키가 제일 무난한가요?",
        likeCount: 24,
        isLiked: false,
        replyCount: 2,
        replies: [
          {
            commentId: 206,
            parentId: 105,
            nickname: "맛있는하루",
            profileUrl: "https://picsum.photos/id/102/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(2, 3), // 2~3일 전
            content:
              "네, 쿠키가 가장 쉬워요! 특히 초코칩 쿠키나 버터 쿠키는 재료도 간단하고 실패할 확률이 낮아요. 그 다음으로는 머핀이나 스콘이 도전하기 좋아요. 오븐만 있다면 생각보다 쉽게 만들 수 있답니다!",
            likeCount: 18,
            isLiked: true,
          },
          {
            commentId: 207,
            parentId: 105,
            nickname: "베이킹퀸",
            profileUrl: "https://picsum.photos/id/103/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "초보자라면 계량이 가장 중요해요! 정확한 계량을 위해 전자저울 꼭 사용하세요. 그리고 쿠키는 실패해도 맛있게 먹을 수 있어서 정말 좋은 입문 베이킹이에요. 화이팅하세요!",
            likeCount: 15,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 106,
        parentId: undefined,
        nickname: "디저트러버",
        profileUrl: "https://picsum.photos/id/104/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(3, 4), // 3~4일 전
        content:
          "마카롱은 정말 까다로워요. 저도 10번 넘게 실패했어요. 가장 중요한 건 '마카로나주'라는 반죽 접기 과정과 숙성이에요. 유튜브에 '1일 마카롱'이라고 검색해보세요. 초보자를 위한 쉬운 레시피가 많이 나와요!",
        likeCount: 31,
        isLiked: true,
        replyCount: 1,
        replies: [
          {
            commentId: 208,
            parentId: 106,
            nickname: "맛있는하루",
            profileUrl: "https://picsum.photos/id/102/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "정보 감사합니다! 마카로나주가 그렇게 중요한 과정이었군요. 추천해주신 유튜브 영상 찾아볼게요. 아무래도 첫 도전은 실패할 각오를 하고 해야겠어요 ㅎㅎ",
            likeCount: 9,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 107,
        parentId: undefined,
        nickname: "홈베이킹맘",
        profileUrl: "https://picsum.photos/id/106/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(3, 4), // 3~4일 전
        content:
          "오 쿠키가 정말 맛있어 보여요! 마카롱은 처음부터 완벽하게 만들기 어려우니 실패해도 좌절하지 마세요. 저는 3번째에 겨우 성공했어요. 가장 중요한 건 계란 흰자의 상태와 오븐 온도예요. 오븐 온도계도 따로 구매하시는 걸 추천드려요!",
        likeCount: 27,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 다른 사용자가 작성한 글 2
  {
    postId: 3,
    nickname: "여행가이드",
    profileUrl: "https://picsum.photos/id/1011/50/50",
    userType: getRandomUserType(),
    createdAt: "2025-04-03T12:10:22Z",
    title: "제주도 여행 필수 코스 공유합니다",
    content:
      "지난 주에 제주도 3박 4일 여행을 다녀왔는데요, 정말 좋았던 코스들을 공유합니다! 첫째 날은 성산일출봉과 우도, 둘째 날은 한라산 등반(영실 코스), 셋째 날은 서쪽 해안가와 오설록 티 뮤지엄, 마지막 날은 올레길 7코스를 걸었어요. 특히 올레길이 정말 아름다웠습니다. 숙소는 서귀포에 위치한 펜션에서 묵었고요. 렌트카는 필수! 여행 경비는 1인당 약 80만원 정도 들었네요. 제주도 여행 계획 중이신 분들께 도움이 되길 바랍니다.",
    likeCount: 89,
    commentCount: 4,
    isLiked: true,
    isScrapped: true,
    comments: [
      {
        commentId: 108,
        parentId: undefined,
        nickname: "세계여행자",
        profileUrl: "https://picsum.photos/id/1015/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(3, 4), // 3~4일 전
        content:
          "좋은 정보 감사합니다! 저도 다음 달에 제주도 여행 계획 중인데 많은 도움이 될 것 같아요. 혹시 우도에서는 어떤 교통수단을 이용하셨나요? 전기자전거가 편하다던데 추천하시나요?",
        likeCount: 23,
        isLiked: false,
        replyCount: 3,
        replies: [
          {
            commentId: 209,
            parentId: 108,
            nickname: "여행가이드",
            profileUrl: "https://picsum.photos/id/1011/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(2, 3), // 2~3일 전
            content:
              "우도에서는 전기자전거 타고 돌았어요! 비용은 2시간에 2만원 정도였고, 섬 전체를 돌기에 충분했습니다. 특히 우도봉 근처의 경치가 정말 좋으니 꼭 들러보세요!",
            likeCount: 15,
            isLiked: true,
          },
          {
            commentId: 210,
            parentId: 108,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "저도 작년에 갔었는데 전기자전거 강추합니다! 우도땅콩아이스크림도 꼭 드셔보세요. 정말 맛있어요~",
            likeCount: 12,
            isLiked: false,
          },
          {
            commentId: 211,
            parentId: 108,
            nickname: "맛집탐험가",
            profileUrl: "https://picsum.photos/id/1074/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 1), // 1일 전
            content:
              "우도는 전기자전거가 최고예요! 서두르지 않고 풍경 구경하면서 천천히 돌아볼 수 있어요. 참고로 배 탈 때 멀미약 챙기세요. 당일 바다 상태에 따라 배가 많이 흔들릴 수 있어요.",
            likeCount: 8,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 109,
        parentId: undefined,
        nickname: "제주도민",
        profileUrl: "https://picsum.photos/id/1018/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(2, 3), // 2~3일 전
        content:
          "제주도민으로서 정말 잘 돌아보셨네요! 추가로 추천드리자면 비가 많이 오는 날에는 '제주 신화월드'나 '네스트 호텔'에 있는 실내 워터파크도 좋아요. 또 구좌읍 쪽의 '비자림'도 산책하기 정말 좋은 곳이랍니다.",
        likeCount: 35,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 212,
            parentId: 109,
            nickname: "여행가이드",
            profileUrl: "https://picsum.photos/id/1011/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "제주도민분의 추천이라니 정말 감사합니다! 다음에 갈 때는 꼭 비자림도 가볼게요. 혹시 숨겨진 맛집이 있다면 추천해주실 수 있나요?",
            likeCount: 18,
            isLiked: false,
          },
          {
            commentId: 213,
            parentId: 109,
            nickname: "제주도민",
            profileUrl: "https://picsum.photos/id/1018/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 1), // 1일 전
            content:
              "함덕 해수욕장 근처의 '어느 식당'이란 곳이 있는데, 고등어회가 정말 맛있어요! 관광객들은 잘 모르는 현지인 맛집이랍니다. 예약은 필수예요!",
            likeCount: 24,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 110,
        parentId: undefined,
        nickname: "사진작가",
        profileUrl: "https://picsum.photos/id/1019/50/50",
        userType: "ICTR",
        createdAt: getRandomDate(2, 3), // 2~3일 전
        content:
          "성산일출봉 사진이 정말 멋지네요! 어떤 카메라로 찍으셨나요? 구도도 너무 좋아요. 저도 다음 달에 제주도 가는데 사진 팁 있으면 공유해주세요~",
        likeCount: 19,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 214,
            parentId: 110,
            nickname: "여행가이드",
            profileUrl: "https://picsum.photos/id/1011/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 1), // 1일 전
            content:
              "사진은 그냥 아이폰 14 프로로 찍었어요! 일출 시간에 가시면 역광으로 멋진 사진을 찍을 수 있어요. 성산일출봉은 아침 일찍 가는 게 좋아요. 관광객도 적고 빛도 정말 예쁘답니다!",
            likeCount: 14,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 111,
        parentId: undefined,
        nickname: "초보여행자",
        profileUrl: "https://picsum.photos/id/1029/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-23T15:00:00Z",
        content:
          "한라산 등반 난이도는 어떤가요? 등산 초보도 도전해볼만 한가요? 영실 코스가 제일 쉬운 코스인가요?",
        likeCount: 16,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 4번째 게시글
  {
    postId: 4,
    nickname: "개발자김코딩",
    profileUrl: "https://picsum.photos/id/1005/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-22T16:34:56Z",
    title: "개발자를 위한 좋은 유튜브 채널 추천해주세요",
    content:
      "안녕하세요, 주니어 웹 개발자입니다. 요즘 프론트엔드 개발 공부를 하고 있는데, 좋은 유튜브 채널이나 강의 추천 부탁드립니다. 특히 리액트와 타입스크립트 관련 콘텐츠를 찾고 있어요. 무료든 유료든 퀄리티가 좋은 강의라면 투자할 의향이 있습니다. 이제 막 개발을 시작한 주니어이지만 1년 안에 프론트엔드 개발자로 취업하는 것이 목표입니다. 여러분의 경험과 조언 부탁드립니다!",
    likeCount: 73,
    commentCount: 5,
    isLiked: true,
    isScrapped: true,
    comments: [
      {
        commentId: 112,
        parentId: undefined,
        nickname: "10년차개발자",
        profileUrl: "https://picsum.photos/id/1010/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-22T17:00:00Z",
        content:
          "코딩애플, 노마드코더, 드림코딩 채널 추천합니다. 한국어로 된 강의들 중에서는 이 세 채널이 가장 퀄리티가 좋은 것 같아요. 특히 드림코딩의 리액트 기초 강의는 정말 좋습니다. 노마드코더의 '리액트 마스터' 클래스도 유료지만 가성비가 좋아요.",
        likeCount: 45,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 215,
            parentId: 112,
            nickname: "개발자김코딩",
            profileUrl: "https://picsum.photos/id/1005/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T17:15:00Z",
            content:
              "감사합니다! 드림코딩 채널은 들어본 적 있는데 한번 제대로 찾아볼게요. 혹시 타입스크립트 관련해서도 특별히 추천하시는 채널이 있나요?",
            likeCount: 12,
            isLiked: false,
          },
          {
            commentId: 216,
            parentId: 112,
            nickname: "10년차개발자",
            profileUrl: "https://picsum.photos/id/1010/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T17:30:00Z",
            content:
              "타입스크립트는 영어 강의지만 'Matt Pocock'의 'Total TypeScript' 강의가 최고예요. 유료지만 그만한 가치가 있습니다. 무료로는 'Ben Awad'의 타입스크립트 기초 영상이 좋아요.",
            likeCount: 20,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 113,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: "2023-06-22T18:00:00Z",
        content:
          "저도 프론트엔드 공부 중인데요, Traversy Media와 Web Dev Simplified 채널도 정말 좋아요! 영어지만 쉽게 설명해주셔서 따라가기 좋습니다. 그리고 유데미(Udemy)에서 강의 할인할 때 구매하면 1~2만원에 퀄리티 좋은 강의를 들을 수 있어요.",
        likeCount: 28,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 217,
            parentId: 113,
            nickname: "개발자김코딩",
            profileUrl: "https://picsum.photos/id/1005/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T18:15:00Z",
            content:
              "영어 강의도 추천해주셔서 감사합니다! 유데미 할인 정보도 좋네요. 유데미는 할인할 때 사는 게 좋다고 들었어요. 혹시 특별히 추천하시는 유데미 강사가 있으신가요?",
            likeCount: 14,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 114,
        parentId: undefined,
        nickname: "리액트마스터",
        profileUrl: "https://picsum.photos/id/1012/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-22T19:00:00Z",
        content:
          "프론트엔드 개발자라면 'Fireship' 채널도 꼭 봐야합니다. 짧은 영상으로 트렌드를 빠르게 파악할 수 있어요. 'Theo - ping.gg' 채널도 고급 리액트와 타입스크립트 팁을 많이 공유합니다. 책으로는 '리액트를 다루는 기술'이 좋아요. 그리고 공식 문서도 꼭 읽어보세요!",
        likeCount: 36,
        isLiked: false,
        replyCount: 3,
        replies: [
          {
            commentId: 218,
            parentId: 114,
            nickname: "개발자김코딩",
            profileUrl: "https://picsum.photos/id/1005/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T19:15:00Z",
            content:
              "Fireship 채널은 처음 들어봤네요! 찾아볼게요. '리액트를 다루는 기술'은 국내서적인가요? 요즘 트렌드에 맞는 내용인지 궁금합니다.",
            likeCount: 9,
            isLiked: false,
          },
          {
            commentId: 219,
            parentId: 114,
            nickname: "리액트마스터",
            profileUrl: "https://picsum.photos/id/1012/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T19:30:00Z",
            content:
              "네, 김민준님이 쓰신 국내서적이에요. 개정판이 나와서 최신 리액트 버전까지 다루고 있어요. 입문자에게 정말 좋습니다. 공식 문서도 꼭 보세요. 리액트 공식 문서는 최근에 완전히 새로 개편되어서 튜토리얼 퀄리티가 정말 좋아졌어요.",
            likeCount: 18,
            isLiked: true,
          },
          {
            commentId: 220,
            parentId: 114,
            nickname: "타스러버",
            profileUrl: "https://picsum.photos/id/1014/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T19:45:00Z",
            content:
              "타입스크립트 공부하실 때 타입스크립트 공식 핸드북도 정말 좋아요. 무료인데 번역된 자료도 있고 예제도 많습니다. 그리고 타입스크립트는 실전 프로젝트를 해보면서 배우는 게 가장 효과적이더라구요.",
            likeCount: 15,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 115,
        parentId: undefined,
        nickname: "취준생",
        profileUrl: "https://picsum.photos/id/1025/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-22T20:00:00Z",
        content:
          "저도 1년 전에 개발 공부 시작해서 최근에 취업했어요! 강의도 중요하지만 포트폴리오 프로젝트가 더 중요해요. 간단한 투두앱부터 시작해서 점점 규모를 키워가는 걸 추천드립니다. 그리고 GitHub에 꾸준히 커밋하는 습관도 중요해요.",
        likeCount: 42,
        isLiked: true,
        replyCount: 1,
        replies: [
          {
            commentId: 221,
            parentId: 115,
            nickname: "개발자김코딩",
            profileUrl: "https://picsum.photos/id/1005/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-22T20:15:00Z",
            content:
              "실제 취업하신 분의 조언 정말 감사합니다! 포트폴리오가 중요하다는 말을 많이 들었어요. 혹시 어떤 프로젝트들을 포트폴리오로 준비하셨는지 더 자세히 알 수 있을까요?",
            likeCount: 8,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 116,
        parentId: undefined,
        nickname: "시니어개발자",
        profileUrl: "https://picsum.photos/id/1027/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-22T21:00:00Z",
        content:
          "공부도 중요하지만 실무에서는 문제 해결 능력이 더 중요합니다. 강의를 보면서 '왜 이렇게 구현했는지'에 대해 항상 생각하세요. 또한 CSS와 기본 자바스크립트 개념도 확실히 다지는 것이 중요합니다. 화려한 프레임워크보다 기본기가 탄탄해야 나중에 어떤 기술이 나와도 적응할 수 있어요.",
        likeCount: 51,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 5번째 게시글
  {
    postId: 5,
    nickname: "영화광",
    profileUrl: "https://picsum.photos/id/1074/50/50",
    userType: getRandomUserType(),
    createdAt: "2025-04-02T12:10:22Z",
    title: "요즘 넷플릭스에서 꼭 봐야할 작품 공유해요",
    content:
      "안녕하세요! 영화와 드라마를 정말 좋아하는 영화광입니다. 최근 넷플릭스에서 본 작품들 중 정말 추천하고 싶은 작품들을 공유해요. 1. '퀸스 갬빗' - 체스를 소재로 한 미니시리즈인데 스토리와 연출력이 정말 훌륭해요. 2. '오징어 게임' - 이미 다들 아시겠지만 재미와 메시지 모두 뛰어납니다. 3. '테드 래소' - 애플TV+ 작품이지만 정말 따뜻하고 유쾌한 코미디! 4. '스트레인저 씽스 시즌4' - 시즌을 거듭할수록 더 흥미진진해집니다. 5. '더 글로리' - 한국 드라마 중에서도 연출과 연기가 돋보이는 작품. 여러분의 추천작도 알려주세요!",
    likeCount: 95,
    commentCount: 4,
    isLiked: false,
    isScrapped: false,
    comments: [
      {
        commentId: 117,
        parentId: undefined,
        nickname: "드라마덕후",
        profileUrl: "https://picsum.photos/id/1062/50/50",
        userType: getRandomUserType(),
        createdAt: "2025-04-03T14:00:00Z",
        content:
          "'더 베어' 정말 추천합니다! 요리를 소재로 한 드라마인데, 인간 드라마로서도 정말 뛰어나요. 주방 장면의 리얼함과 캐릭터들의 성장이 인상적입니다. 그리고 '블랙 미러'도 SF 좋아하시는 분들께 강추합니다. 각 에피소드가 독립적이라 편하게 보기도 좋아요.",
        likeCount: 33,
        isLiked: true,
        replyCount: 6,
        replies: [
          {
            commentId: 222,
            parentId: 117,
            nickname: "영화광",
            profileUrl: "https://picsum.photos/id/1074/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-03T14:15:00Z",
            content:
              "'더 베어' 저도 봤는데 정말 좋았어요! 특히 7화 원컷 에피소드는 압권이었죠. '블랙 미러'는 좀 무서워서 망설여지긴 하는데 한번 도전해봐야겠어요. 혹시 가장 추천하는 에피소드가 있을까요?",
            likeCount: 18,
            isLiked: false,
          },
          {
            commentId: 223,
            parentId: 117,
            nickname: "드라마덕후",
            profileUrl: "https://picsum.photos/id/1062/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-03T14:30:00Z",
            content:
              "블랙 미러는 처음 보신다면 'San Junipero'나 'Hang the DJ' 같은 비교적 밝은 에피소드부터 보시는 걸 추천해요! 무서운 것보다는 디스토피아적 미래를 그린 작품이라 한번 시작하면 빠져들게 됩니다.",
            likeCount: 24,
            isLiked: true,
          },
          {
            commentId: 224,
            parentId: 117,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2025-04-03T14:45:00Z",
            content:
              "저도 '더 베어' 정말 재밌게 봤어요! 요리하는 장면들이 너무 사실적이라 보면서 배고파졌어요 ㅎㅎ 추천해주신 '블랙 미러'도 한번 찾아봐야겠네요.",
            likeCount: 15,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 118,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: "2025-04-03T15:00:00Z",
        content:
          "'브리저튼'도 정말 재밌게 봤어요! 시대물이지만 현대적인 감각으로 재해석해서 신선했습니다. 음악과 의상도 너무 아름다웠구요. 로맨스 장르 좋아하시는 분들께 추천합니다. 그리고 '미스터 션샤인'도 한국 작품 중에서도 넷플릭스에서 볼 수 있는 걸작이에요.",
        likeCount: 27,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 225,
            parentId: 118,
            nickname: "영화광",
            profileUrl: "https://picsum.photos/id/1074/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-03T15:15:00Z",
            content:
              "'브리저튼' 음악이 정말 좋죠! 팝송을 현악으로 편곡한 게 신선했어요. '미스터 션샤인'은 아직 못 봤는데, 기대가 되네요. 역사물이라 시간 여유 있을 때 정주행해봐야겠어요. 추천 감사합니다!",
            likeCount: 14,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 119,
        parentId: undefined,
        nickname: "SF매니아",
        profileUrl: "https://picsum.photos/id/1070/50/50",
        userType: "ICTR",
        createdAt: "2025-04-04T16:00:00Z",
        content:
          "SF 장르 좋아하시는 분들께는 '러브, 데스 + 로봇'을 추천합니다! 각 에피소드마다 다른 애니메이션 스타일과 SF 스토리를 보여줘서 지루할 틈이 없어요. 특히 '조라의 목격자'와 '나쁜 여행' 에피소드는 정말 인상적이었습니다. 그리고 '다크'라는 독일 드라마도 시간여행을 소재로 한 복잡한 스토리가 매력적이에요.",
        likeCount: 39,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 226,
            parentId: 119,
            nickname: "영화광",
            profileUrl: "https://picsum.photos/id/1074/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-04T16:15:00Z",
            content:
              "'러브, 데스 + 로봇' 정말 독특한 시리즈죠! 짧은 러닝타임이라 부담없이 볼 수 있어서 좋아요. '다크'는 너무 복잡해서 중간에 포기했었는데, 다시 도전해봐야겠어요. 시간을 들여볼 만한 가치가 있나요?",
            likeCount: 12,
            isLiked: false,
          },
          {
            commentId: 227,
            parentId: 119,
            nickname: "SF매니아",
            profileUrl: "https://picsum.photos/id/1070/50/50",
            userType: "ICTR",
            createdAt: "2025-04-04T16:30:00Z",
            content:
              "'다크'는 확실히 집중해서 봐야하는 작품이에요. 가계도를 옆에 두고 보는 걸 추천합니다 ㅎㅎ 하지만 끝까지 보면 모든 퍼즐이 맞춰지는 쾌감이 있어서, 시간 투자할 만한 가치가 충분합니다! 시즌 3까지 완결된 작품이라 결말까지 볼 수 있어요.",
            likeCount: 18,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 120,
        parentId: undefined,
        nickname: "넷플릭스중독",
        profileUrl: "https://picsum.photos/id/1083/50/50",
        userType: getRandomUserType(),
        createdAt: "2025-04-04T17:00:00Z",
        content:
          "요즘 화제인 '원피스' 실사화도 기대 이상이었어요! 원작 팬으로서 걱정했는데, 생각보다 캐릭터와 세계관을 잘 살렸더라구요. 그리고 범죄 다큐 좋아하시는 분들께는 '메이킹 어 머더러'와 '사악한 천재'를 추천합니다. 실화 기반이라 더 몰입되는 것 같아요.",
        likeCount: 31,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 6번째 게시글
  {
    postId: 6,
    nickname: "식물집사",
    profileUrl: "https://picsum.photos/id/1029/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-20T10:23:34Z",
    title: "식물 키우기 처음인데 잘 키울 수 있는 식물 추천해주세요",
    content:
      "안녕하세요! 최근에 방 안에 작은 식물 하나 정도는 키워보고 싶다는 생각이 들었어요. 하지만 식물을 키워본 경험이 전혀 없고, 출장도 자주 가는 편이라 관리가 쉬운 식물을 찾고 있습니다. 햇빛도 거실에만 잘 들고 방은 약간 어두운 편이에요. 이런 환경에서도 초보자가 잘 키울 수 있는 식물이 있을까요? 식물 키우시는 분들의 조언 부탁드립니다!",
    likeCount: 62,
    commentCount: 4,
    isLiked: false,
    isScrapped: true,
    comments: [
      {
        commentId: 121,
        parentId: undefined,
        nickname: "반려식물러버",
        profileUrl: "https://picsum.photos/id/1056/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-20T11:00:00Z",
        content:
          "스투키, 산세베리아, 몬스테라는 초보자들도 키우기 쉬운 식물들이에요! 특히 스투키는 2주에 한 번 정도만 물을 줘도 잘 자라고, 햇빛이 약한 곳에서도 잘 자랍니다. 산세베리아(일명 산세)도 비슷하게 관리가 쉽고 공기정화 효과도 있어서 인기가 많아요. 그리고 중요한 건 물을 너무 자주 주지 않는 것! 대부분의 식물들은 과습으로 죽는 경우가 많습니다.",
        likeCount: 42,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 228,
            parentId: 121,
            nickname: "식물집사",
            profileUrl: "https://picsum.photos/id/1029/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-20T11:15:00Z",
            content:
              "자세한 추천 감사합니다! 산세베리아는 들어본 적 있는데 스투키는 처음 들어봐요. 이름도 귀엽네요. 과습 조심하라는 조언도 감사합니다. 혹시 화분 크기는 어느 정도가 적당할까요?",
            likeCount: 15,
            isLiked: false,
          },
          {
            commentId: 229,
            parentId: 121,
            nickname: "반려식물러버",
            profileUrl: "https://picsum.photos/id/1056/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-20T11:30:00Z",
            content:
              "처음이시라면 지름 15cm 내외의 화분으로 시작하시는 게 좋을 것 같아요. 너무 큰 화분에 심으면 흙이 많아서 과습되기 쉽거든요. 그리고 꼭 배수구멍이 있는 화분을 사용하세요! 물 주고 30분 후에 받침대에 고인 물은 버려주는 게 좋아요.",
            likeCount: 18,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 122,
        parentId: undefined,
        nickname: "공기정화식물",
        profileUrl: "https://picsum.photos/id/1060/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-20T12:00:00Z",
        content:
          "햇빛이 별로 없는 방에는 포토스도 추천드려요! 포토스는 덩굴식물이라 걸어두면 아래로 주렁주렁 자라서 인테리어 효과도 있어요. 그리고 아이비(헤데라)도 비슷하게 키우기 쉽고 공기정화 효과가 뛰어나요. 두 식물 모두 일주일에 한 번 정도 물만 주면 되고, 번식력도 좋아서 나중에 꺾꽂이로 늘릴 수도 있답니다.",
        likeCount: 35,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 230,
            parentId: 122,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-20T12:15:00Z",
            content:
              "저도 식린이인데 포토스로 시작했어요! 3개월 째 잘 키우고 있습니다. 정말 물만 가끔 주면 알아서 잘 자라요. 특히 물을 잘 안줘도 괜찮다는 게 출장 다니시는 분께 좋을 것 같아요.",
            likeCount: 16,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 123,
        parentId: undefined,
        nickname: "다육이덕후",
        profileUrl: "https://picsum.photos/id/1080/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-20T13:00:00Z",
        content:
          "출장을 자주 가신다면 다육식물이나 선인장류도 좋아요! 한 달에 한 번 정도만 물을 줘도 충분히 살 수 있거든요. 다만 이런 식물들은 햇빛을 좋아해서, 가끔씩 거실로 옮겨서 햇빛을 쬐어주시면 좋아요. 다육식물 중에서는 에케베리아나 하월시아 종류가 예쁘고 키우기 쉬운 편입니다.",
        likeCount: 28,
        isLiked: false,
        replyCount: 5,
        replies: [
          {
            commentId: 231,
            parentId: 123,
            nickname: "식물집사",
            profileUrl: "https://picsum.photos/id/1029/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-20T13:15:00Z",
            content:
              "다육식물이 예쁜 것 같긴 한데, 햇빛을 많이 좋아한다면 제 방 환경에는 안 맞을 수도 있겠네요. 일주일에 한 번씩 옮겨줄 수 있으면 좋겠지만, 출장으로 2주 정도 집을 비울 때도 있어서요. 이런 경우에도 잘 견딜 수 있는 품종이 있을까요?",
            likeCount: 10,
            isLiked: false,
          },
          {
            commentId: 232,
            parentId: 123,
            nickname: "다육이덕후",
            profileUrl: "https://picsum.photos/id/1080/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-20T13:30:00Z",
            content:
              "그렇다면 햇빛 요구량이 적은 스투키나 산세베리아가 가장 적합할 것 같아요. 특히 스투키는 물 없이 2주 정도는 충분히 버틸 수 있어요. 출장 전에 한 번 물을 주고 가시면 됩니다!",
            likeCount: 14,
            isLiked: true,
          },
          {
            commentId: 233,
            parentId: 123,
            nickname: "선인장덕후",
            profileUrl: "https://picsum.photos/id/1082/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-20T14:00:00Z",
            content:
              "저는 게으른 식집사라 선인장만 키워요 ㅋㅋ 특히 귀여운 미니 선인장들은 거의 방치해도 잘 크더라구요. 단, 겨울에는 추위를 조금 타니 난방이 잘 되는 곳에 두시면 좋아요!",
            likeCount: 9,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 124,
        parentId: undefined,
        nickname: "화분컬렉터",
        profileUrl: "https://picsum.photos/id/1084/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-20T15:00:00Z",
        content:
          "모두들 좋은 추천을 해주셨네요! 저는 한 가지 팁을 더 드리자면, 식물 구매하실 때 큰 화분보다는 작은 화분에 심어진 식물로 시작하시는 게 좋아요. 그리고 이왕이면 플라스틱 화분보다 테라코타(점토) 화분이 통기성이 좋아서 과습 방지에 도움이 됩니다. 초보자가 제일 많이 하는 실수는 '너무 자주 물을 주는 것'이니 일주일에 한 번 정도만 주시고, 겉흙이 말랐는지 손가락으로 확인해보세요!",
        likeCount: 40,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 7번째 게시글
  {
    postId: 7,
    nickname: "캠핑마니아",
    profileUrl: "https://picsum.photos/id/1061/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-19T09:45:12Z",
    title: "처음 캠핑 가는데 꼭 필요한 장비 추천해주세요",
    content:
      "다음 주에 친구들과 첫 캠핑을 가기로 했어요! 근데 장비가 하나도 없어서 무엇을 사야 할지 모르겠네요. 솔캠도 아니고 4인 기준으로 갈 예정이라 너무 비싼 장비보다는 입문용으로 괜찮은 제품들 추천해주세요. 텐트, 타프, 의자, 테이블 등 꼭 필요한 장비 목록과 가성비 좋은 제품 추천 부탁드립니다. 그리고 처음 캠핑 가는 사람으로서 주의할 점도 알려주시면 감사하겠습니다!",
    likeCount: 78,
    commentCount: 5,
    isLiked: true,
    isScrapped: false,
    comments: [
      {
        commentId: 125,
        parentId: undefined,
        nickname: "캠핑5년차",
        profileUrl: "https://picsum.photos/id/1055/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-19T10:00:00Z",
        content:
          "처음이시라면 렌탈샵 이용도 좋은 방법이에요! 한번 경험해보고 맞다 싶으면 구매하는 게 경제적이죠. 그래도 구매하신다면 1) 텐트: 코베아 엘프돔 같은 원터치텐트 2) 타프: 처음엔 생략해도 됨 3) 의자: 접이식 경량 체어 4) 테이블: 높이조절 가능한 롤테이블 5) 랜턴: LED 캠핑랜턴 6) 버너와 코펠(취사도구) 정도가 기본 장비입니다. 모두 사면 40~50만원 정도 예산 생각하세요!",
        likeCount: 56,
        isLiked: true,
        replyCount: 3,
        replies: [
          {
            commentId: 234,
            parentId: 125,
            nickname: "캠핑마니아",
            profileUrl: "https://picsum.photos/id/1061/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T10:15:00Z",
            content:
              "자세한 답변 감사합니다! 렌탈샵이라는 방법은 생각도 못했네요. 좋은 팁입니다. 혹시 추천하시는 인터넷 렌탈샵이 있을까요? 그리고 코베아 엘프돔은 초보자도 설치하기 쉬운가요?",
            likeCount: 14,
            isLiked: false,
          },
          {
            commentId: 235,
            parentId: 125,
            nickname: "캠핑5년차",
            profileUrl: "https://picsum.photos/id/1055/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T10:30:00Z",
            content:
              "캠핑큐브나 캠핑인코리아 같은 사이트에서 렌탈 가능해요! 코베아 엘프돔은 원터치텐트라 초보자도 5분 이내로 설치 가능합니다. 유튜브에 설치 영상 많으니 미리 보고 가시면 도움 될 거예요. 참, 그리고 첫 캠핑은 예약 잘 되는 곳으로 가세요. 시설 좋은 오토캠핑장이 편할 거예요.",
            likeCount: 25,
            isLiked: true,
          },
          {
            commentId: 236,
            parentId: 125,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-19T10:45:00Z",
            content:
              "저도 처음 캠핑 갈 때 고민 많았는데, 선배님 조언대로 렌탈로 시작했어요. 확실히 부담이 덜했고, 내게 맞는 장비를 알 수 있어서 좋았어요. 참고로 코베아 말고 네이처하이크 브랜드도 입문용으로 가성비 좋아요!",
            likeCount: 12,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 126,
        parentId: undefined,
        nickname: "백패킹러",
        profileUrl: "https://picsum.photos/id/1059/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-19T11:00:00Z",
        content:
          "첫 캠핑이라면 차박이나 오토캠핑장부터 시작하는 걸 추천해요! 편의시설이 잘 갖춰져 있어서 실패 확률이 적습니다. 장비는 텐트(4인용 팝업텐트), 침낭, 매트, 랜턴, 의자, 테이블이 기본이고, 요리할 계획이면 버너와 코펠도 필요해요. 처음부터 비싼 제품은 추천하지 않아요. 주의사항으론 1) 미리 텐트 설치 연습하기 2) 날씨 체크 필수 3) 밤에 추울 수 있으니 옷 챙기기 4) 벌레 퇴치제 꼭 챙기기 정도가 있어요!",
        likeCount: 42,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 237,
            parentId: 126,
            nickname: "캠핑마니아",
            profileUrl: "https://picsum.photos/id/1061/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T11:15:00Z",
            content:
              "팝업텐트가 설치는 편하겠네요! 그리고 벌레 퇴치제는 생각도 못했어요, 좋은 팁 감사합니다. 혹시 캠핑 요리 초보자도 쉽게 할 수 있는 메뉴 추천해주실 수 있나요?",
            likeCount: 16,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 127,
        parentId: undefined,
        nickname: "캠핑요리사",
        profileUrl: "https://picsum.photos/id/1072/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-19T12:00:00Z",
        content:
          "캠핑 초보 요리라면 1) 바베큐: 고기와 채소 손질해서 가면 편해요 2) 부대찌개: 재료 미리 썰어서 가서 끓이기만 하면 됩니다 3) 라면: 칼로리 걱정 없이 먹을 수 있는 유일한 시간! 4) 팬 요리: 소세지, 베이컨, 계란 등 간단한 아침 메뉴. 1회용 종이접시와 비닐장갑 많이 챙겨가세요. 그리고 설거지가 제일 귀찮으니 설거지통도 필요해요. 물티슈는 캠핑의 필수템입니다!",
        likeCount: 49,
        isLiked: true,
        replyCount: 5,
        replies: [
          {
            commentId: 238,
            parentId: 127,
            nickname: "캠핑마니아",
            profileUrl: "https://picsum.photos/id/1061/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T12:15:00Z",
            content:
              "와 정말 구체적인 메뉴 추천 감사합니다! 부대찌개 아이디어 좋네요. 바베큐할 때 필요한 장비는 그릴과 숯 정도면 될까요?",
            likeCount: 10,
            isLiked: false,
          },
          {
            commentId: 239,
            parentId: 127,
            nickname: "캠핑요리사",
            profileUrl: "https://picsum.photos/id/1072/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T12:30:00Z",
            content:
              "그릴, 숯, 토치(숯 피울 때 필요), 집게, 가위, 앞치마, 장갑이 필요해요. 그리고 양념통과 소금, 후추 같은 기본 양념도 필수! 캠핑장에서 바베큐할 때는 주변 사람들 연기 피해 안 가게 주의하세요.",
            likeCount: 15,
            isLiked: true,
          },
          {
            commentId: 240,
            parentId: 127,
            nickname: "주말캠퍼",
            profileUrl: "https://picsum.photos/id/1073/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T12:45:00Z",
            content:
              "저는 캠핑 갈 때 식재료 손질해서 진공팩에 넣어가요. 고기는 양념까지 재워서 가면 현장에서 귀찮은 작업이 줄어들어요. 요즘은 감자, 계란 등을 익혀주는 전기 멀티쿠커도 인기 많아요!",
            likeCount: 12,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 128,
        parentId: undefined,
        nickname: "캠핑장마스터",
        profileUrl: "https://picsum.photos/id/1076/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-19T13:00:00Z",
        content:
          "첫 캠핑에 중요한 건 캠핑장 선택이에요! 1) 화장실/샤워실 시설 좋은 곳 2) 사이트 간격 넓은 곳 3) 물가/하천 근처는 모기 많으니 주의 4) 차에서 사이트까지 거리가 가까운 곳이 짐 나르기 편해요. 예약은 캠핑톡, 고캠핑 같은 앱 이용하시면 편해요. 그리고 귀가할 때 쓰레기 분리수거 잘 하는 것도 캠핑 매너입니다!",
        likeCount: 38,
        isLiked: false,
        replyCount: 2,
        replies: [
          {
            commentId: 241,
            parentId: 128,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-19T13:15:00Z",
            content:
              "캠핑장 선택이 정말 중요하죠! 저는 처음에 시설 별로인 곳 가서 고생했어요 ㅠㅠ 특히 화장실이 멀면 밤에 정말 불편해요. 캠핑톡 앱은 저도 추천합니다!",
            likeCount: 8,
            isLiked: false,
          },
          {
            commentId: 242,
            parentId: 128,
            nickname: "캠핑마니아",
            profileUrl: "https://picsum.photos/id/1061/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-19T13:30:00Z",
            content:
              "좋은 조언 감사합니다! 캠핑톡 앱 바로 설치해봤어요. 혹시 서울 근교에 초보자에게 추천하는 캠핑장이 있을까요?",
            likeCount: 7,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 129,
        parentId: undefined,
        nickname: "글램핑러버",
        profileUrl: "https://picsum.photos/id/1079/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-19T14:00:00Z",
        content:
          "첫 캠핑이라면 글램핑이나 카라반 같은 시설 좋은 곳도 고려해보세요! 장비 없이도 캠핑 분위기를 즐길 수 있어서 입문자들에게 인기가 많아요. 장비 구매할 돈으로 좋은 곳에서 시설 좋은 곳에서 즐기는 것도 방법이에요. 경기도 가평, 양평 쪽에 글램핑장이 많이 있어요. 그리고 첫 캠핑은 1박 2일로 계획하세요. 너무 길게 잡으면 체력적으로 힘들 수 있어요!",
        likeCount: 33,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 8번째 게시글
  {
    postId: 8,
    nickname: "와인애호가",
    profileUrl: "https://picsum.photos/id/1068/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-18T18:30:45Z",
    title: "와인 입문자를 위한 추천 와인 리스트",
    content:
      "안녕하세요, 와인을 5년째 즐기고 있는 애호가입니다. 주변 친구들이 와인을 시작하고 싶은데 뭐부터 마셔야 할지 모르겠다고 자주 물어봐서, 제가 추천하는 입문자용 와인 목록을 공유합니다! 1) 레드와인: 몽그라스 까베르네 소비뇽(칠레), 옐로우테일 쉬라즈(호주) 2) 화이트와인: 산타 리타 120 샤도네이(칠레), 어니스트 와인메이커스 리슬링(미국) 3) 스파클링: 프로세코 도크(이탈리아), 까바 브뤼(스페인). 모두 2만원 이하의 가성비 좋은 와인들이에요. 여러분만의 와인 추천이 있다면 댓글로 공유해주세요!",
    likeCount: 86,
    commentCount: 3,
    isLiked: true,
    isScrapped: true,
    comments: [
      {
        commentId: 130,
        parentId: undefined,
        nickname: "와인마니아",
        profileUrl: "https://picsum.photos/id/1077/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-18T19:00:00Z",
        content:
          "좋은 리스트 공유 감사합니다! 저도 입문자들에게 추천하는 와인이 있어요. 레드와인 중에는 '19 크라임즈'가 미국 와인인데 초보자도 쉽게 즐길 수 있는 달콤한 맛이에요. 화이트와인은 '킴 크로포드 소비뇽 블랑'이 뉴질랜드 와인으로 상큼한 맛이 일품이죠. 그리고 와인 마실 때 치즈 플레이트나 간단한 안주가 함께 하면 더 맛있게 즐길 수 있어요!",
        likeCount: 47,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 243,
            parentId: 130,
            nickname: "와인애호가",
            profileUrl: "https://picsum.photos/id/1068/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-18T19:15:00Z",
            content:
              "크라임즈! 정말 좋은 추천이네요. 저도 좋아하는 와인 중 하나예요. 살짝 달콤하면서도 깊은 맛이 있어서 입문자들이 쉽게 접근할 수 있죠. 킴 크로포드도 인기 많은 소비뇽 블랑이죠. 좋은 추천 감사합니다!",
            likeCount: 20,
            isLiked: false,
          },
          {
            commentId: 244,
            parentId: 130,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-18T19:30:00Z",
            content:
              "와인에 어울리는 치즈 종류도 알 수 있을까요? 와인 마실 때 항상 어떤 치즈를 선택해야 할지 고민이 되더라고요.",
            likeCount: 15,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 131,
        parentId: undefined,
        nickname: "소믈리에지망생",
        profileUrl: "https://picsum.photos/id/1078/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-18T20:00:00Z",
        content:
          "와인 초보자들이 알아두면 좋은 팁들도 공유할게요! 1) 레드와인은 실온(약 16-18도), 화이트와인은 차갑게(약 8-10도) 마시는 게 좋아요 2) 와인잔은 볼이 큰 것이 향을 즐기기 좋습니다 3) 와인은 한 번에 1/3정도만 따라 마시는 게 좋아요 4) 와인을 맛볼 때는 '보고, 돌리고, 향 맡고, 맛보는' 순서로! 그리고 @반짝이는하마님 질문에 답변드리자면, 레드와인에는 숙성된 하드치즈(파마산, 체다 등), 화이트와인에는 부드러운 치즈(브리, 까망베르 등)가 잘 어울립니다!",
        likeCount: 56,
        isLiked: false,
        replyCount: 6,
        replies: [
          {
            commentId: 245,
            parentId: 131,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-18T20:15:00Z",
            content:
              "와! 치즈 추천까지 감사합니다. 정말 도움이 많이 되네요. 혹시 와인 보관법도 간단히 알려주실 수 있을까요? 와인 한 병을 다 못 마셨을 때 어떻게 보관해야 하는지 궁금합니다.",
            likeCount: 18,
            isLiked: false,
          },
          {
            commentId: 246,
            parentId: 131,
            nickname: "소믈리에지망생",
            profileUrl: "https://picsum.photos/id/1078/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-18T20:30:00Z",
            content:
              "와인 남았을 때는 전용 와인 마개로 밀봉해서 냉장고에 보관하세요! 레드와인도 개봉 후에는 냉장 보관이 좋아요. 그래도 빨리 마시는 게 좋은데, 보통 2-3일 내에는 맛이 크게 변하지 않아요. 전용 진공 펌프 마개가 있으면 더 오래 보관할 수 있답니다!",
            likeCount: 22,
            isLiked: true,
          },
          {
            commentId: 247,
            parentId: 131,
            nickname: "와인애호가",
            profileUrl: "https://picsum.photos/id/1068/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-18T20:45:00Z",
            content:
              "좋은 팁 감사합니다! 저도 코라빈이라는 도구 추천드려요. 병을 따지 않고도 와인을 따를 수 있어서, 한 잔씩 마시고 싶을 때 유용해요. 와인을 여러 종류 조금씩 즐기고 싶은 분들에게 좋은 도구입니다.",
            likeCount: 19,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 132,
        parentId: undefined,
        nickname: "와인바사장",
        profileUrl: "https://picsum.photos/id/1083/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-18T21:00:00Z",
        content:
          "와인을 처음 접하는 분들께 조언 하나 더 드리자면, 꼭 가격으로만 와인을 판단하지 마세요! 2-3만원대 와인 중에도 정말 맛있는 와인이 많고, 반대로 비싼 와인이 모두 입맛에 맞는 건 아니랍니다. 그리고 와인 테이스팅 모임이나 클래스에 한번 참여해보는 것도 추천해요. 다양한 와인을 한 번에 맛볼 수 있고, 와인에 대한 지식도 쌓을 수 있어요. 서울 시내 백화점이나 와인샵에서 종종 무료 시음회도 열리니 관심 있으신 분들은 찾아보세요!",
        likeCount: 41,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 9번째 게시글
  {
    postId: 9,
    nickname: "독서광",
    profileUrl: "https://picsum.photos/id/1066/50/50",
    userType: getRandomUserType(),
    createdAt: "2025-04-01T13:12:45Z",
    title: "2025년 상반기 베스트 책 추천",
    content:
      "올해 상반기 동안 읽은 책 중에서 정말 좋았던 책들을 공유합니다! 1) '공정하다는 착각' - 마이클 샌델의 새 책으로 능력주의에 대한 날카로운 분석이 인상적입니다. 2) '달러구트 꿈 백화점' - 판타지 소설인데 재미와 감동이 있어요. 3) '애쓰지 않고 편안하게' - 하워드 최의 에세이로 현대인의 불안에 대한 통찰이 깊습니다. 4) '팩트풀니스' - 세계를 바라보는 관점을 바꿔주는 책이에요. 5) '미움받을 용기' - 아들러 심리학 입문서로 자기계발서 중 최고! 여러분이 최근에 감명 깊게 읽은 책이 있다면 댓글로 공유해주세요!",
    likeCount: 91,
    commentCount: 4,
    isLiked: false,
    isScrapped: true,
    comments: [
      {
        commentId: 133,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: "2025-04-02T12:30:00Z",
        content:
          "좋은 책 목록 감사합니다! 저는 최근에 '기분을 관리하면 인생이 관리된다'라는 책을 읽었는데 정말 좋았어요. 감정 조절에 어려움을 겪는 현대인들에게 실질적인 도움이 되는 책이었습니다. 그리고 '돈의 속성'이라는 책도 재테크 입문서로 도움이 많이 됐어요. '달러구트 꿈 백화점'은 저도 읽어봤는데 정말 재미있었어요!",
        likeCount: 36,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 248,
            parentId: 133,
            nickname: "독서광",
            profileUrl: "https://picsum.photos/id/1066/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-03T12:45:00Z",
            content:
              "'기분을 관리하면 인생이 관리된다'라는 책은 저도 들어본 적 있어요! 꼭 읽어봐야겠네요. 요즘 감정 관리에 관심이 많아서 딱 좋을 것 같습니다. 추천 감사합니다!",
            likeCount: 17,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 134,
        parentId: undefined,
        nickname: "문학소녀",
        profileUrl: "https://picsum.photos/id/1071/50/50",
        userType: getRandomUserType(),
        createdAt: "2025-04-02T13:00:00Z",
        content:
          "소설 좋아하시는 분들께 추천합니다! '밝은 밤'(최은영 작가), '위저드 베이커리'(구병모 작가), '어서 오세요, 휴남동 서점입니다'(황보름 작가) 모두 올해 읽은 한국 소설 중 최고였어요. 특히 '밝은 밤'은 가족의 의미에 대해 생각해보게 되는 아름다운 작품입니다. 외국 소설로는 '베르나르 베르베르'의 '개미' 시리즈를 다시 읽었는데, 오래된 책이지만 여전히 통찰력 있는 내용이 많아요!",
        likeCount: 45,
        isLiked: true,
        replyCount: 5,
        replies: [
          {
            commentId: 249,
            parentId: 134,
            nickname: "독서광",
            profileUrl: "https://picsum.photos/id/1066/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-04T13:15:00Z",
            content:
              "'밝은 밤' 저도 정말 감명 깊게 읽었어요! 최은영 작가의 문체가 정말 아름답더라고요. '위저드 베이커리'는 들어본 적 있는데 아직 못 읽었네요. 한번 도전해봐야겠어요! 베르베르의 '개미'는 정말 클래식이죠.",
            likeCount: 19,
            isLiked: false,
          },
          {
            commentId: 250,
            parentId: 134,
            nickname: "소설덕후",
            profileUrl: "https://picsum.photos/id/1064/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-04T13:30:00Z",
            content:
              "저는 '구의 증명'이라는 최진영 작가의 소설도 추천드려요! 짧지만 강렬한 인상을 주는 소설이에요. 그리고 '이기적 유전자'라는 과학책도 흥미롭게 읽었습니다. 리처드 도킨스의 명저죠.",
            likeCount: 22,
            isLiked: true,
          },
          {
            commentId: 251,
            parentId: 134,
            nickname: "문학소녀",
            profileUrl: "https://picsum.photos/id/1071/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-05T13:45:00Z",
            content:
              "'구의 증명' 정말 좋은 작품이죠! 최진영 작가님이 일찍 돌아가셔서 정말 안타까워요. 정말 훌륭한 작가였는데... '이기적 유전자'는 저도 대학생 때 감명 깊게 읽었던 책이에요. 과학책인데도 세계관을 바꿔놓는 책이었어요.",
            likeCount: 18,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 135,
        parentId: undefined,
        nickname: "북스타그래머",
        profileUrl: "https://picsum.photos/id/1075/50/50",
        userType: getRandomUserType(),
        createdAt: "2025-04-05T14:00:00Z",
        content:
          "요즘 에세이 많이 읽고 있는데요, '층간소음'(김하나 작가), '나는 나로 살기로 했다'(김수현 작가), '당신이 옳다'(정혜신 작가) 모두 현대인의 고민을 다루는 좋은 책이었어요. 그리고 투자에 관심 있으신 분들께는 '존 리의 투자대습전'과 '네이버는 어떻게 네이버가 되었나'도 추천합니다. 그리고 올해의 신간 중에는 '어른의 국어력'이라는 책이 의외로 재미있었어요. 말과 글의 중요성을 다시 한번 생각하게 된 책이었습니다!",
        likeCount: 37,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 252,
            parentId: 135,
            nickname: "에세이매니아",
            profileUrl: "https://picsum.photos/id/1069/50/50",
            userType: getRandomUserType(),
            createdAt: "2025-04-06T14:15:00Z",
            content:
              "에세이 추천 감사합니다! '나는 나로 살기로 했다'는 저도 정말 좋아하는 책이에요. 위로가 필요할 때 다시 꺼내 읽게 되는 책이죠. '어른의 국어력'이라는 책은 처음 들어보는데 저도 한번 찾아봐야겠네요. 사소한 말 습관이 삶에 큰 영향을 준다고 생각하거든요.",
            likeCount: 14,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 136,
        parentId: undefined,
        nickname: "독서클럽장",
        profileUrl: "https://picsum.photos/id/1067/50/50",
        userType: getRandomUserType(),
        createdAt: "2025-04-06T15:00:00Z",
        content:
          "좋은 책 추천 감사합니다! 책 읽기에 흥미가 생긴 분들께 도움이 될 만한 독서 팁도 공유할게요. 1) 하루에 조금씩이라도 꾸준히 읽는 게 중요해요. 2) 책의 내용을 간단하게라도 메모해두면 기억에 오래 남아요. 3) 다양한 장르의 책을 읽으면 세상을 바라보는 시야가 넓어져요. 4) 독서 모임에 참여하면 다양한 해석도 들을 수 있고 독서 습관도 길러집니다. 5) 전자책과 종이책을 병행하면 상황에 따라 더 편리하게 책을 읽을 수 있어요. 모두 즐거운 독서 하세요!",
        likeCount: 48,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 10번째 게시글
  {
    postId: 10,
    nickname: "헬스매니아",
    profileUrl: "https://picsum.photos/id/1009/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-16T08:20:15Z",
    title: "3개월 만에 10kg 감량한 운동 루틴 공유합니다",
    content:
      "안녕하세요, 헬스 시작한지 6개월 된 헬스매니아입니다! 처음 3개월 동안 다이어트에 성공해서 그 방법을 공유할게요. 식단은 간단히 탄수화물 조절 + 단백질 위주로 했고, 운동은 일주일에 5일 다음과 같이 진행했어요. 월: 가슴+삼두 / 화: 등+이두 / 수: 하체+복근 / 목: 휴식 / 금: 어깨+복근 / 토: 전신 유산소 / 일: 휴식. 각 부위별 3~4가지 운동을 3세트씩 했고, 유산소는 30분 인터벌(30초 전력질주 + 1분 30초 천천히)로 했어요. 처음에는 헬스장이 어색했지만 이제는 없으면 안될 취미가 되었네요. 여러분의 다이어트/운동 꿀팁도 댓글로 공유해주세요!",
    likeCount: 82,
    commentCount: 5,
    isLiked: true,
    isScrapped: true,
    comments: [
      {
        commentId: 137,
        parentId: undefined,
        nickname: "PT강사",
        profileUrl: "https://picsum.photos/id/1025/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-16T08:45:00Z",
        content:
          "좋은 루틴이네요! 제가 PT강사로 일하면서 느낀 점은 '꾸준함'이 가장 중요하다는 겁니다. 3개월 동안 정말 잘 하셨어요. 추가 팁을 드리자면, 세트 사이에 60~90초 휴식이 근비대에 좋고, 다이어트를 위해선 근력운동 후 유산소가 효과적입니다. 그리고 식단도 중요한데, 하루 단백질은 체중 1kg당 1.6~2g 정도 섭취하는 것이 근손실 없는 다이어트에 도움이 됩니다!",
        likeCount: 45,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 253,
            parentId: 137,
            nickname: "헬스매니아",
            profileUrl: "https://picsum.photos/id/1009/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T09:00:00Z",
            content:
              "전문가 의견 감사합니다! 휴식 시간은 아직 체계적으로 관리하지 못했는데, 앞으로 스톱워치로 재봐야겠네요. 단백질은 보충제로 추가 섭취하고 있는데, 식품으로 섭취하는 게 더 좋을까요?",
            likeCount: 13,
            isLiked: false,
          },
          {
            commentId: 254,
            parentId: 137,
            nickname: "PT강사",
            profileUrl: "https://picsum.photos/id/1025/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T09:15:00Z",
            content:
              "단백질은 가급적 닭가슴살, 계란, 생선 같은 실제 식품으로 섭취하는 것이 영양소 균형에 좋지만, 바쁜 현대인들에게 보충제도 좋은 대안입니다. 보충제는 운동 직후 섭취하고, 나머지는 식품으로 채우는 방식이 이상적이에요. 그리고 충분한 수분 섭취도 잊지 마세요!",
            likeCount: 18,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 138,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: "2023-06-16T09:30:00Z",
        content:
          "저도 최근에 헬스 시작했는데 3개월 만에 10kg은 정말 대단하네요! 혹시 식단 관리는 어떻게 하셨나요? 특히 저녁에 자꾸 군것질하게 되는데 이런 유혹을 어떻게 이겨내셨는지 궁금합니다.",
        likeCount: 23,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 255,
            parentId: 138,
            nickname: "헬스매니아",
            profileUrl: "https://picsum.photos/id/1009/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T09:45:00Z",
            content:
              "저도 원래 야식 엄청 좋아했어요! 처음엔 정말 힘들었는데, 두 가지 방법으로 극복했습니다. 1) 저녁은 단백질 위주로 든든하게 먹어서 배고픔 최소화하기 2) 간식은 완전히 끊기보다 '대체하기' - 과자 대신 닭가슴살 육포, 달달한 것이 당길 땐 프로틴 바나 그릭요거트에 견과류 섞어 먹는 등 건강한 간식으로 바꿨어요. 참, 물 많이 마시는 것도 도움이 됩니다!",
            likeCount: 25,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 139,
        parentId: undefined,
        nickname: "다이어트7개월차",
        profileUrl: "https://picsum.photos/id/1012/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-16T10:00:00Z",
        content:
          "저는 비슷한 루틴으로 7개월째 다이어트 중인데, 처음 3개월은 정말 빠르게 빠지다가 그 이후로는 정체기가 왔어요. 혹시 정체기 극복 방법 알고 계신가요? 그리고 추천하는 헬스 유튜브 채널 있으면 공유해주세요! 저는 '피지컬갤러리'랑 '서울헬스바이블' 자주 보는데 도움이 많이 됩니다.",
        likeCount: 31,
        isLiked: true,
        replyCount: 6,
        replies: [
          {
            commentId: 256,
            parentId: 139,
            nickname: "헬스매니아",
            profileUrl: "https://picsum.photos/id/1009/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T10:15:00Z",
            content:
              "정체기 저도 경험 중이에요ㅠㅠ 최근에 시도하는 방법은 '리버스 다이어팅'인데요, 2주 정도 칼로리를 조금씩 올리면서 대사량을 회복시키고 다시 다이어트하는 방식입니다. 유튜브는 저도 피지컬갤러리 좋아하고, 외국 채널로는 'Jeff Nippard'와 'Jeremy Ethier'도 과학적 근거 기반으로 설명해줘서 좋아요!",
            likeCount: 19,
            isLiked: false,
          },
          {
            commentId: 257,
            parentId: 139,
            nickname: "헬스장지박령",
            profileUrl: "https://picsum.photos/id/1060/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T10:30:00Z",
            content:
              "정체기에는 운동 루틴을 완전히 바꿔보는 것도 좋아요! 몸이 현재 루틴에 적응해서 더 이상 변화가 없는 거니까요. 저는 3개월마다 프로그램을 바꾸는데, 세트수, 무게, 휴식시간 등을 조절하거나 완전히 다른 운동으로 대체하기도 합니다. '오마이트레이너'라는 유튜브도 추천해요!",
            likeCount: 16,
            isLiked: true,
          },
          {
            commentId: 258,
            parentId: 139,
            nickname: "PT강사",
            profileUrl: "https://picsum.photos/id/1025/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T10:45:00Z",
            content:
              "정체기는 다이어트에서 자연스러운 과정입니다. 체중이 줄면 기초대사량도 감소하기 때문이죠. 1) 식단보다는 운동 강도 올리기 2) HIIT 같은 고강도 운동 추가하기 3) 근력운동에서 초과중량법(같은 무게로 한계까지) 시도하기 등이 도움됩니다. 그리고 반드시 체중계보다는 체성분계로 체지방률 변화를 확인하세요!",
            likeCount: 27,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 140,
        parentId: undefined,
        nickname: "식단조절중",
        profileUrl: "https://picsum.photos/id/1062/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-16T11:00:00Z",
        content:
          "운동 루틴에 대해 자세히 알려주셔서 감사합니다! 식단 관리가 가장 어려운데, 전 외식이 잦은 직장인이라 점심 메뉴 선택이 항상 고민이에요. 외식할 때 추천하는 메뉴가 있을까요? 그리고 혹시 사용하는 운동/식단 기록 앱이 있으신지도 궁금합니다.",
        likeCount: 18,
        isLiked: false,
        replyCount: 2,
        replies: [
          {
            commentId: 259,
            parentId: 140,
            nickname: "다이어트7개월차",
            profileUrl: "https://picsum.photos/id/1012/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T11:15:00Z",
            content:
              "외식 시 제가 자주 선택하는 메뉴는 1) 닭가슴살 샐러드 2) 일반 한식 차림에서는 반찬 위주로 적게 먹고 고기/생선 위주로 3) 설렁탕 같은 국물요리(기름 걷어내고) 4) 보쌈/삼겹살(지방 떼고 단백질 위주로). 앱은 MyFitnessPal로 식단 기록하고, Strong으로 운동 루틴 관리해요. 둘 다 무료 버전으로도 충분합니다!",
            likeCount: 12,
            isLiked: true,
          },
          {
            commentId: 260,
            parentId: 140,
            nickname: "헬스매니아",
            profileUrl: "https://picsum.photos/id/1009/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T11:30:00Z",
            content:
              "외식 팁 하나 더 드리자면, 주문 전에 물 한 잔 마시고, 식사 시작하면 야채/샐러드부터 먹는 것도 도움됩니다! 그리고 치킨은 튀김옷 떼고 먹거나, 피자는 도우 말고 토핑 위주로 먹는 방법도 있어요. 앱은 저는 '다이어트 신' 사용 중인데 한국 음식 DB가 잘 되어 있어서 좋습니다!",
            likeCount: 15,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 141,
        parentId: undefined,
        nickname: "운동초보",
        profileUrl: "https://picsum.photos/id/1074/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-16T12:00:00Z",
        content:
          "헬스를 시작하고 싶은데 정말 아무것도 모르겠어요. 처음 헬스장 가면 뭐부터 해야 할까요? PT는 몇 회 정도 받는 게 좋을까요? 그리고 운동복/운동화는 어떤 걸로 사야 하나요? 기본적인 것부터 조언 부탁드립니다ㅠㅠ",
        likeCount: 24,
        isLiked: true,
        replyCount: 3,
        replies: [
          {
            commentId: 261,
            parentId: 141,
            nickname: "PT강사",
            profileUrl: "https://picsum.photos/id/1025/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T12:15:00Z",
            content:
              "처음 시작하실 때는 1) 우선 간단한 스트레칭과 가벼운 유산소(속보/조깅)로 몸 풀기 2) 기본 머신 위주로 전신 운동 익히기 3) 무게보다 자세에 집중하기가 중요합니다. PT는 최소 10회 정도는 받는 게 좋아요(기본 자세와 루틴 잡는데 필요). 운동복은 흡습속건 소재, 운동화는 편안한 러닝화나 트레이닝화면 충분합니다!",
            likeCount: 21,
            isLiked: true,
          },
          {
            commentId: 262,
            parentId: 141,
            nickname: "헬스매니아",
            profileUrl: "https://picsum.photos/id/1009/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T12:30:00Z",
            content:
              "저도 처음엔 너무 무서웠어요! 유튜브로 기본 운동법 좀 보고 가면 덜 어색해요. 처음엔 가벼운 무게로 시작해서 점점 늘려가는 게 좋고요. 헬스장에 처음 가면 직원분께 기구 사용법 간단히 알려달라고 부탁드려도 됩니다. 그리고 운동 전 식사는 1시간 전에 가볍게, 물은 수시로 마시는 게 좋아요!",
            likeCount: 14,
            isLiked: false,
          },
          {
            commentId: 263,
            parentId: 141,
            nickname: "헬린이졸업생",
            profileUrl: "https://picsum.photos/id/1027/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-16T12:45:00Z",
            content:
              "저도 1년 전 헬린이였는데요, 처음에는 모두가 나만 쳐다보는 것 같아 부끄러웠지만, 사실 다들 자기 운동에만 집중해요! 부담 갖지 마시고, 처음 1달은 그냥 헬스장에 '가는 습관'을 들이는 게 중요해요. 무리하게 시작했다가 근육통으로 포기하는 분들 많거든요. 천천히, 꾸준히가 핵심입니다!",
            likeCount: 18,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
    ],
  },

  // 11번째 게시글
  {
    postId: 11,
    nickname: "냥이집사",
    profileUrl: "https://picsum.photos/id/1062/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-15T09:15:30Z",
    title: "고양이 입양 1개월 차, 알면 좋았을 것들 공유해요",
    content:
      "한 달 전 첫 고양이를 입양한 초보 집사입니다! 처음 키우면서 몰랐던 것들, 알면 좋았을 것들을 정리해서 공유해요. 1. 화장실 적응은 생각보다 빨라요. 하지만 처음엔 모래를 몇 종류 준비해두면 고양이 취향을 파악하는데 도움됩니다. 2. 고양이는 높은 곳을 좋아해요. 캣타워나 선반을 설치해주면 스트레스가 줄어듭니다. 3. 스크래쳐는 여러 종류를 준비하세요. 세로형, 박스형, 경사형 등 고양이마다 선호하는 게 달라요. 4. 장난감은 비싼 것보다 낚싯대 형태가 반응이 좋더라구요. 5. 사료는 갑자기 바꾸면 탈이 날 수 있으니 조금씩 섞어서 적응시켜야 해요. 6. 화장실은 최소 두 개(고양이 수+1) 필요합니다. 여러분의 집사 꿀팁도 알려주세요!",
    likeCount: 76,
    commentCount: 4,
    isLiked: false,
    isScrapped: true,
    comments: [
      {
        commentId: 142,
        parentId: undefined,
        nickname: "3묘집사",
        profileUrl: "https://picsum.photos/id/1074/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-15T09:45:00Z",
        content:
          "좋은 정보 감사합니다! 저는 3마리 키우는 집사인데, 추가 팁을 드리자면 1) 발톱깎이에 미리 적응시키는 게 좋아요. 어릴 때부터 발을 자주 만져주면 나중에 발톱 깎을 때 덜 스트레스 받아요. 2) 물그릇은 밥그릇과 멀리 두세요. 고양이들은 물과 먹이를 분리해서 먹는 습성이 있어요. 3) 그루밍 중 토할 때가 있는데, 대부분 평소에 빠진 털 때문이니 놀라지 마세요. 정기적인 빗질이 중요합니다. 집사 생활 즐거우시길 바랍니다!",
        likeCount: 38,
        isLiked: true,
        replyCount: 1,
        replies: [
          {
            commentId: 264,
            parentId: 142,
            nickname: "냥이집사",
            profileUrl: "https://picsum.photos/id/1062/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-15T10:00:00Z",
            content:
              "발톱깎이 팁 정말 감사합니다! 아직 발톱깎이에 적응을 못 시켜서 고민이었거든요. 발을 만지는 연습부터 해봐야겠어요. 물그릇도 지금 밥그릇 옆에 두고 있었는데 분리해서 놔야겠네요. 3마리... 정말 부럽습니다 ㅎㅎ",
            likeCount: 14,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 143,
        parentId: undefined,
        nickname: "베테랑집사",
        profileUrl: "https://picsum.photos/id/1084/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-15T10:15:00Z",
        content:
          "10년차 고양이 집사로서 건강 관련 팁을 드릴게요! 1) 습식 사료(캔)을 정기적으로 급여하면 수분 섭취에 도움이 됩니다. 고양이는 물을 잘 안 마시는 동물이라 요로 건강에 좋아요. 2) 구토나 설사가 24시간 이상 지속되면 바로 병원에 가세요. 고양이는 아픈 티를 잘 안 내서 증상이 보이면 이미 많이 아픈 경우가 많아요. 3) 정기검진은 1년에 한 번은 필수입니다. 4) 실내 고양이는 비만 위험이 높으니 장난감으로 충분한 운동을 시켜주세요. 5) 화분식물 중 고양이에게 유독한 것들이 많으니 확인 필수입니다(백합, 튤립 등).",
        likeCount: 45,
        isLiked: false,
        replyCount: 5,
        replies: [
          {
            commentId: 265,
            parentId: 143,
            nickname: "냥이집사",
            profileUrl: "https://picsum.photos/id/1062/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-15T10:30:00Z",
            content:
              "건강 관련 팁 정말 감사합니다! 저희 아이는 물을 잘 안 마시는데, 습식 사료를 주면 좋겠네요. 식물 이야기는 처음 들었어요. 저희 집에 있는 식물들 당장 확인해봐야겠어요. 혹시 반려동물 보험은 들어두시나요? 추천하시는지 궁금합니다.",
            likeCount: 16,
            isLiked: true,
          },
          {
            commentId: 266,
            parentId: 143,
            nickname: "베테랑집사",
            profileUrl: "https://picsum.photos/id/1084/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-15T10:45:00Z",
            content:
              "반려동물 보험은 정말 추천합니다! 특히 중성화 수술이나 예상치 못한 질병/사고에 대비할 수 있어요. 우리나라도 요즘은 다양한 펫보험이 있으니 비교해보세요. 참고로 동물병원비는 정말 비싸서 응급실 한 번 가면 15~20만원은 기본이더라고요.",
            likeCount: 20,
            isLiked: false,
          },
          {
            commentId: 267,
            parentId: 143,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-15T11:00:00Z",
            content:
              "고양이용 분수대 급수기도 추천합니다! 저희 고양이는 일반 물그릇에선 잘 안 마시다가 분수대 놔주니까 물 마시는 양이 확실히 늘었어요. 그리고 고양이 종류에 따라 건강 이슈가 다를 수 있으니 품종 특성도 미리 알아두시면 좋을 것 같아요.",
            likeCount: 13,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 144,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: "2023-06-15T11:15:00Z",
        content:
          "고양이 행동에 대한 팁도 공유할게요! 1) 꼬리를 빠르게 흔들면 짜증/화가 난 상태니 건드리지 마세요 2) 배를 보여주는 건 신뢰의 표시지만, 모든 고양이가 배 만지는 걸 좋아하진 않아요 3) 눈을 천천히 깜빡이는 건 '사랑해'라는 뜻! 마주 깜빡여주세요 4) 똑같은 장난감도 새로 나오면 흥미를 보이니 로테이션으로 장난감 사용하기 5) 그루밍은 스트레스 해소용이지만 지나치게 많이 하면 스트레스 신호일 수 있어요. 집사 생활 행복하시길 바랍니다!",
        likeCount: 32,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 268,
            parentId: 144,
            nickname: "냥이집사",
            profileUrl: "https://picsum.photos/id/1062/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-15T11:30:00Z",
            content:
              "행동 팁 감사합니다! 장난감 로테이션은 정말 좋은 아이디어네요. 저희 냥이가 가끔 배를 보여주는데 만지면 바로 할퀴더라고요ㅠㅠ 이제 이유를 알았네요. 눈 깜빡이는 것도 해봐야겠어요. 혹시 야옹거림도 의미가 있나요? 종류별로 다른 의미가 있는 것 같은데 해석이 어렵네요 ㅎㅎ",
            likeCount: 11,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 145,
        parentId: undefined,
        nickname: "캣맘",
        profileUrl: "https://picsum.photos/id/1069/50/50",
        userType: "ICTR",
        createdAt: "2023-06-15T12:00:00Z",
        content:
          "좋은 정보 감사해요! 저는 길고양이 케어 활동을 하는 캣맘인데, 고양이 입양 후 주의사항 몇 가지 더 알려드릴게요. 1) 방문할 때 항상 고양이 위치 확인하기(문틈새로 탈출 주의) 2) 창문에 방충망 설치 필수(하이라이즈 증후군 예방) 3) 세탁기/건조기 사용 전 항상 확인(좁은 공간에 숨어있을 수 있음) 4) 변기 뚜껑 닫기(물에 빠질 위험) 5) 작은 장난감 삼키지 않도록 주의 6) 전선은 커버 씌우거나 정리하기(물어뜯을 수 있음) 7) 중성화는 건강을 위해 꼭 해주세요. 사랑으로 잘 키워주세요!",
        likeCount: 40,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 12번째 게시글
  {
    postId: 12,
    nickname: "음악덕후",
    profileUrl: "https://picsum.photos/id/1082/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-14T15:45:22Z",
    title: "요즘 힙한 인디밴드 추천 좀 해주세요",
    content:
      "안녕하세요, 음악 좋아하는 덕후입니다. 요즘 인디음악에 관심이 생겼는데 어떤 밴드/아티스트들이 있는지 잘 몰라서 추천 부탁드려요! 좋아하는 장르는 어쿠스틱, 포크, 얼터너티브 락 정도이고, 감성적인 발라드보다는 조금 경쾌한 분위기를 좋아합니다. 기존에는 넬, 혁오, 잔나비 정도만 들었는데 비슷한 느낌의 밴드들이 있을까요? 그리고 요즘 인디씬에서 주목할 만한 공연이나 페스티벌 정보도 있으면 공유해주세요. 음악 감상용 이어폰/헤드폰 추천도 환영합니다!",
    likeCount: 64,
    commentCount: 5,
    isLiked: true,
    isScrapped: false,
    comments: [
      {
        commentId: 146,
        parentId: undefined,
        nickname: "밴드매니아",
        profileUrl: "https://picsum.photos/id/1035/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-14T16:00:00Z",
        content:
          "인디 밴드 좋아하시는군요! 제가 즐겨듣는 밴드들 추천드립니다. 1) 설(SURL) - 10대 밴드지만 음악 퀄리티가 정말 좋아요 2) 아도이(adoy) - 레트로 감성의 신스팝 3) 새소년 - 황소윤 보컬의 독특한 음색이 매력적 4) 실리카겔 - 취향이 갈릴 수 있지만 색다른 매력 5) 쏜애플 - 잔나비 좋아하시면 이쪽도 좋아하실 듯! 그리고 '서울숲재즈페스티벌'이 이번 주말에 있으니 관심 있으시면 가보세요. 인디 밴드들도 많이 나온답니다.",
        likeCount: 35,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 269,
            parentId: 146,
            nickname: "음악덕후",
            profileUrl: "https://picsum.photos/id/1082/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T16:15:00Z",
            content:
              "와! 자세한 추천 감사합니다. 설이랑 아도이는 들어봤는데 나머지는 처음 들어보네요. 바로 찾아들어야겠어요. 서울숲재즈페스티벌도 찾아봐야겠습니다. 혹시 이런 밴드들 음악 많이 들을 수 있는 플레이리스트나 유튜브 채널 같은 것도 있을까요?",
            likeCount: 12,
            isLiked: false,
          },
          {
            commentId: 270,
            parentId: 146,
            nickname: "밴드매니아",
            profileUrl: "https://picsum.photos/id/1035/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T16:30:00Z",
            content:
              "유튜브에 '긱스'(Geeks) 채널이 인디밴드 라이브 영상을 많이 올려요! '마파크'(MAPAC)라는 채널도 괜찮고요. 스포티파이에선 '한국 인디 플레이리스트'로 검색하면 좋은 큐레이션들이 많이 나옵니다. 그리고 네이버 '온스테이지' 영상들도 추천해요. 인디밴드 소식은 '인디포스트'라는 웹진도 좋아요!",
            likeCount: 18,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 147,
        parentId: undefined,
        nickname: "음악장인",
        profileUrl: "https://picsum.photos/id/1072/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-14T17:00:00Z",
        content:
          "장르별로 추천드릴게요! 1) 얼터너티브 락: 이바다, 불스원, 퀘렌시아 2) 포크: 가다, 솔루션스, 몽구스 3) 어쿠스틱: 빌리어코스티, 정승환, 스웨덴세탁소 4) 펑크: 내귀에도청장치, 크라잉넛, 노브레인 5) 시티팝: 게이즈, 마코토, 스침. 공연은 '그린플러그드 페스티벌'이 좋았는데 이미 지났네요. 다음엔 '공간소리' 페스티벌을 노려보세요! 이어폰은 개인적으로 모니터링 이어폰 추천드립니다. KZ ZST Pro나 Tin Audio T2 같은 가성비 좋은 제품들이 있어요.",
        likeCount: 42,
        isLiked: false,
        replyCount: 3,
        replies: [
          {
            commentId: 271,
            parentId: 147,
            nickname: "음악덕후",
            profileUrl: "https://picsum.photos/id/1082/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T17:15:00Z",
            content:
              "이렇게 장르별로 정리해주시니 정말 고맙습니다! 시티팝은 들어본 적이 없는데 한번 찾아들어봐야겠어요. 이어폰 추천도 감사합니다. 지금 에어팟 쓰는데 음질이 아쉬워서 바꿀까 고민 중이었거든요. KZ ZST Pro 가격대가 어떻게 되나요?",
            likeCount: 15,
            isLiked: true,
          },
          {
            commentId: 272,
            parentId: 147,
            nickname: "헤드폰마니아",
            profileUrl: "https://picsum.photos/id/1074/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T17:30:00Z",
            content:
              "KZ ZST Pro는 2~3만원대로 가성비가 매우 좋습니다! 하이브리드 이어폰으로 저음과 고음 밸런스가 좋아요. 단, 케이블이 분리형이라 처음엔 불편할 수 있어요. 좀 더 예산이 있으시면 Moondrop Aria(9만원대)도 추천드립니다. 에어팟과는 다른 깊이있는 음악 감상이 가능할 거예요!",
            likeCount: 18,
            isLiked: false,
          },
          {
            commentId: 273,
            parentId: 147,
            nickname: currentUser.nickname,
            profileUrl: currentUser.profileUrl,
            userType: currentUser.userType,
            createdAt: "2023-06-14T17:45:00Z",
            content:
              "저도 KZ 이어폰 사용하고 있는데 가성비 대비 음질이 정말 좋아요. 그리고 인디 관련해서는 '한깊음악단'이라는 밴드도 한번 들어보세요! 어쿠스틱한 감성의 밴드인데 최근에 정말 좋은 앨범을 발매했어요.",
            likeCount: 12,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 148,
        parentId: undefined,
        nickname: "공연장지박령",
        profileUrl: "https://picsum.photos/id/1025/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-14T18:00:00Z",
        content:
          "인디밴드 공연 정보 알려드릴게요! 홍대, 연남동, 망원동에 있는 소규모 공연장들(롤링홀, 플레이포맷, 벨로주, FF, 무대륙 등)에서 주말마다 인디밴드 공연이 많아요. 인스타그램에서 각 공연장 계정을 팔로우하면 일정을 쉽게 확인할 수 있어요. 티켓은 보통 2~3만원 선이고, 작은 공연장이라 아티스트와 가까이서 호흡할 수 있는 게 매력이죠. 7월에는 '서울숲 뮤직위크'가 있고, 9월에는 '자라섬 재즈페스티벌'이 있어요. 인디 뮤지션들을 응원해주세요!",
        likeCount: 29,
        isLiked: true,
        replyCount: 5,
        replies: [
          {
            commentId: 274,
            parentId: 148,
            nickname: "음악덕후",
            profileUrl: "https://picsum.photos/id/1082/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T18:15:00Z",
            content:
              "소규모 공연장 정보 정말 감사합니다! 인스타그램 바로 찾아봐야겠어요. 혹시 처음 공연 관람하는 사람을 위한 팁 같은 게 있을까요? 티켓 예매는 어디서 하는지, 공연장 매너 같은 것도 궁금합니다.",
            likeCount: 10,
            isLiked: false,
          },
          {
            commentId: 275,
            parentId: 148,
            nickname: "공연장지박령",
            profileUrl: "https://picsum.photos/id/1025/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T18:30:00Z",
            content:
              "티켓 예매는 인터파크, 예스24, 멜론티켓에서 할 수 있고, 작은 공연은 각 공연장 SNS에 올라오는 구글폼이나 사이트로 예매하는 경우도 많아요. 공연 팁은 1) 시간 여유있게 도착하기 2) 핸드폰 소리/진동 꺼두기 3) 플래시 사용 자제 4) 다른 관객 배려하기(너무 큰 함성이나 대화 삼가) 5) 술 마시고 가도 되지만 적당히! 정도가 있겠네요. 인디공연은 분위기가 자유로운 편이니 너무 긴장하지 마세요!",
            likeCount: 16,
            isLiked: true,
          },
          {
            commentId: 276,
            parentId: 148,
            nickname: "인디밴드보컬",
            profileUrl: "https://picsum.photos/id/1080/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T18:45:00Z",
            content:
              "인디밴드 보컬로 활동 중인데요, 저희같은 소규모 밴드에겐 관객분들의 응원이 정말 큰 힘이 됩니다! 공연 후 SNS에 짧은 후기나 사진 올려주시는 것만으로도 큰 홍보가 되니 좋아하는 밴드가 있으시면 적극적으로 응원해주세요. 그리고 공연장에서 MD(굿즈) 구매도 밴드에겐 큰 도움이 된답니다.",
            likeCount: 20,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 149,
        parentId: undefined,
        nickname: "감성충만",
        profileUrl: "https://picsum.photos/id/1042/50/50",
        userType: "ICTR",
        createdAt: "2023-06-14T19:00:00Z",
        content:
          "요즘 제가 자주 듣는 곡들 플레이리스트 공유합니다! 1) 루시 - 개화(Blooming day) 2) 웨터 - 오늘 같은 밤(Autumn Breeze) 3) 소란 - 파도 4) 글렌체크 - Firestruck 5) 데이먼스이어 - 이 도시의 밤 6) 카더가든 - 나무 7) 피아노맨 - Parting 8) 메스그램 - Climax 9) 스웨덴세탁소 - 봄날의 게으름 10) 유라이크 - 왜 불안한거니. 모두 경쾌하면서도 감성있는 노래들이에요. 취향이 비슷하시면 마음에 드실 것 같아요!",
        likeCount: 33,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 277,
            parentId: 149,
            nickname: "음악덕후",
            profileUrl: "https://picsum.photos/id/1082/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-14T19:15:00Z",
            content:
              "완전 제 취향저격 플레이리스트네요! 그 중에서 소란, 글렌체크만 들어봤는데 나머지 아티스트들도 찾아들어야겠어요. 특히 '이 도시의 밤'이란 제목이 끌리네요. 플레이리스트 공유 정말 감사합니다!",
            likeCount: 11,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 150,
        parentId: undefined,
        nickname: "음악큐레이터",
        profileUrl: "https://picsum.photos/id/1055/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-14T20:00:00Z",
        content:
          "저는 음악 큐레이션 일을 하고 있어요. 혹시 해외 인디 밴드도 관심 있으신가요? 요즘 주목받는 해외 인디 밴드도 몇 개 추천드립니다. 1) Boy Pablo(노르웨이) - 청량한 기타 사운드 2) Men I Trust(캐나다) - 몽환적인 분위기의 드림팝 3) Still Woozy(미국) - 편안한 멜로디의 알앤비, 일렉트로닉 믹스 4) Crumb(미국) - 몽환적이면서도 그루비한 사이키델릭 팝 5) Yellow Days(영국) - 빈티지한 소울 사운드. 그리고 좋은 음악 찾으시려면 유튜브 알고리즘보다는 '라디오가든', '인디스트', '배드뉴스' 같은 음악 전문 매체 구독 추천드려요!",
        likeCount: 38,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },

  // 13번째 게시글
  {
    postId: 13,
    nickname: "여행블로거",
    profileUrl: "https://picsum.photos/id/1051/50/50",
    userType: getRandomUserType(),
    createdAt: getRandomDate(5, 10), // 5~10일 전
    title: "태국 방콕 여행기와 꿀팁 공유합니다",
    content:
      "지난달 일주일간 태국 방콕을 다녀왔습니다! 정말 즐거운 여행이었는데요, 많은 분들께 도움이 될 만한 팁들을 공유해요. 1) 교통: 방콕은 교통체증이 심해요! BTS 스카이트레인과 수상보트를 이용하면 빠르게 이동 가능해요. 2) 숙소: 시암, 수쿰빗 지역이 관광하기 좋아요. 3) 쇼핑: 짜뚜짝 주말시장, 씨암 파라곤은 필수! 4) 음식: 길거리 음식도 맛있지만, 위생에 주의하세요. 5) 주의: 왕궁, 사원 방문 시 복장 규정이 있으니 긴 바지, 어깨 가리는 옷 필수! 6) 추천 관광지: 왕궁, 왓 아룬, 짜오프라야 강 디너크루즈, 카오산로드! 7) 쇼핑 팁: 흥정은 필수, 제시된 가격의 절반 정도부터 시작하세요. 질문 있으시면 댓글로 물어보세요!",
    likeCount: 79,
    commentCount: 5,
    isLiked: false,
    isScrapped: true,
    comments: [
      {
        commentId: 151,
        parentId: undefined,
        nickname: "태국러버",
        profileUrl: "https://picsum.photos/id/1047/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(3, 4), // 3~4일 전
        content:
          "좋은 정보 감사합니다! 저도 다음 달에 방콕 여행 예정인데 도움이 많이 되네요. 혹시 방콕에서 치앙마이로 이동하는 방법 중 가장 추천하시는 건 무엇인가요? 비행기, 기차, 버스 중에서요.",
        likeCount: 31,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 278,
            parentId: 151,
            nickname: "여행블로거",
            profileUrl: "https://picsum.photos/id/1051/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(2, 3), // 2~3일 전
            content:
              "방콕에서 치앙마이는 거리가 꽤 되어서 비행기가 가장 편리해요! 저가항공사(에어아시아, 녹에어 등)도 많아서 1~2만원대에 구할 수 있어요. 기차는 밤기차가 유명한데 12시간 넘게 걸리고, 버스는 좀 더 저렴하지만 더 오래 걸려요. 짧은 일정이라면 비행기 추천드려요!",
            likeCount: 18,
            isLiked: false,
          },
          {
            commentId: 279,
            parentId: 151,
            nickname: "백팩커달인",
            profileUrl: "https://picsum.photos/id/1049/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "저는 태국 밤기차 추천해요! 침대칸으로 예약하면 꽤 편하고, 차창 밖 풍경도 볼 수 있어 여행의 또 다른 추억이 됩니다. 단, 기차표는 인기가 많아서 미리 예약하는 게 좋아요(타이철도 사이트나 12Go Asia 앱 이용).",
            likeCount: 15,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 152,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: getRandomDate(2, 3), // 2~3일 전
        content:
          "방콕 물가는 어느 정도인가요? 한국과 비교해서 식비, 숙박비, 교통비가 대략 어떻게 되는지 궁금합니다. 그리고 팁 문화가 있나요?",
        likeCount: 25,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 280,
            parentId: 152,
            nickname: "여행블로거",
            profileUrl: "https://picsum.photos/id/1051/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 2), // 1~2일 전
            content:
              "방콕 물가는 한국보다 확실히 저렴해요! 길거리 음식은 1~2천원, 일반 식당은 5천원 내외, 고급 식당도 1.5만원 정도면 충분해요. 숙소는 저렴한 호스텔은 1만원대, 괜찮은 3성급 호텔은 3~5만원대예요. 교통비는 BTS가 편도 1천원 내외로 아주 저렴해요. 팁 문화는 있지만 강요하진 않고, 고급 레스토랑에서 10% 정도, 택시는 반올림 정도가 일반적이에요!",
            likeCount: 22,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 153,
        parentId: undefined,
        nickname: "아시아여행가",
        profileUrl: "https://picsum.photos/id/1057/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(2, 3), // 2~3일 전
        content:
          "방콕에 4번 다녀온 경험자로서 몇 가지 팁을 더 드리자면, 1) 그랩(Grab)앱을 설치해두면 택시 흥정 없이 편리해요 2) 씨암역 주변의 MBK, 씨암 디스커버리는 짜뚜짝보다 시원하고 쇼핑하기 좋아요 3) 아속역 근처 '딸랏 나이트 바자르'는 저녁에 가볼만한 시장이에요 4) 짜뚜짝은 주말에만 전체 오픈하니 스케줄 참고하세요! 5) 왕궁/왓프라깨우 관람 후 근처 왓포도 함께 가보세요~",
        likeCount: 35,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 281,
            parentId: 153,
            nickname: "방콕러버",
            profileUrl: "https://picsum.photos/id/1063/50/50",
            userType: getRandomUserType(),
            createdAt: getRandomDate(1, 1), // 1일 전
            content:
              "맞아요! 그랩앱 강추합니다. 택시 기사님들이 미터기 안 켜려고 하는 경우가 많은데, 그랩은 가격이 미리 정해져 있어서 편해요. 추가로 팁 하나 더 드리자면 '여행자용 심카드'는 공항보다 시내 세븐일레븐에서 사는 게 더 싸고 다양해요!",
            likeCount: 17,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 154,
        parentId: undefined,
        nickname: "먹방여행러",
        profileUrl: "https://picsum.photos/id/1065/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(1, 2), // 1~2일 전
        content:
          "방콕 음식 꿀팁도 공유해요! 1) 트럭으로 다니는 '빠타이' 노점은 현지인들도 줄 서서 먹을 정도로 유명해요 2) '꾸어이띠아오'라는 쌀국수는 길거리에서 흔히 볼 수 있는 저렴하고 맛있는 메뉴 3) 망고스틱키라이스는 방콕에서 꼭 먹어봐야 하는 디저트 4) 치앙마이와 달리 방콕은 약간 매운 편이니 참고하세요 5) 수상가옥 시장인 '담넌 사두악' 수상시장도 정말 특별한 경험이었어요!",
        likeCount: 29,
        isLiked: true,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
      {
        commentId: 155,
        parentId: undefined,
        nickname: "사진여행가",
        profileUrl: "https://picsum.photos/id/1060/50/50",
        userType: getRandomUserType(),
        createdAt: getRandomDate(1, 1), // 1일 전
        content:
          "방콕에서 인생샷 건질 수 있는 장소 공유해요! 1) 왓아룬 사원의 석양 2) 루프톱바 '버티고'에서 보는 방콕 야경 3) 아유타야 유적지의 붉은 벽돌 사원들 4) 왓포의 거대 와불 5) 담넌 사두악 수상시장의 배 위 상인들. 특히 골든아워(일출, 일몰 무렵)에 방문하면 더 멋진 사진을 얻을 수 있어요!",
        likeCount: 27,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },
  // 14번째 게시글
  {
    postId: 14,
    nickname: "여행매니아",
    profileUrl: "https://picsum.photos/id/1040/50/50",
    userType: getRandomUserType(),
    createdAt: "2023-06-12T10:20:35Z",
    title: "유럽 여행 한 달, 꿀팁 모음",
    content:
      "드디어 오랜 꿈이었던 유럽 한 달 여행을 다녀왔습니다! 많은 분들에게 도움이 될만한 꿀팁들을 공유할게요. 1) 교통: 유레일패스는 3개국 이상 여행할 경우 경제적. 저가항공은 라이언에어, 이지젯 활용 2) 숙소: 호스텔은 Hostelworld, 아파트는 Airbnb, 호텔은 Booking.com에서 예약 3) 유심: 유럽 전역 사용 가능한 Orange 유심이 가성비 좋음 4) 입장권: GetYourGuide나 공식 사이트에서 사전예약 필수(루브르, 바티칸 등) 5) 물가: 북유럽>서유럽>남유럽>동유럽 순으로 비쌈 6) 팁 문화: 대부분 10% 내외, 동유럽은 없는 경우도 7) 안전: 바르셀로나, 파리, 로마 등 대도시 소매치기 주의 8) 추천 도시: 헝가리 부다페스트(가성비), 이탈리아 피렌체(예술), 포르투갈 포르투(분위기). 질문 있으시면 댓글로 남겨주세요!",
    likeCount: 87,
    commentCount: 4,
    isLiked: true,
    isScrapped: true,
    comments: [
      {
        commentId: 156,
        parentId: undefined,
        nickname: "백팩커",
        profileUrl: "https://picsum.photos/id/1043/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-12T11:00:00Z",
        content:
          "정말 유용한 정보 감사합니다! 저도 유럽 여행 경험자로서 몇 가지 팁을 추가할게요. 1) 물은 슈퍼에서 사는 게 훨씬 저렴해요(레스토랑은 3~4배 비쌈) 2) 박물관/미술관은 무료 입장일이 있는지 확인하세요(주로 첫째/마지막 일요일) 3) 환전은 현지 ATM 이용이 수수료 적게 듬(Wise 카드 추천) 4) 유럽 기차는 보통 시간 정확한데 이탈리아는 예외... 5) 숙소는 중심가보다 약간 외곽이 가성비 좋고, 대중교통 패스가 있으면 충분히 편리해요. 혹시 여름에 다녀오셨나요? 더위 대처는 어떻게 하셨는지 궁금합니다!",
        likeCount: 42,
        isLiked: true,
        replyCount: 2,
        replies: [
          {
            commentId: 285,
            parentId: 156,
            nickname: "여행매니아",
            profileUrl: "https://picsum.photos/id/1040/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-12T11:15:00Z",
            content:
              "좋은 팁 감사합니다! ATM 이용 팁은 정말 유용하네요. 저는 5월에 다녀와서 더위가 심하진 않았어요. 다만 남부 유럽(그리스, 이탈리아)은 5월에도 꽤 더웠는데, 휴대용 미니 선풍기와 물병을 항상 가지고 다녔어요. 유럽은 에어컨 없는 곳이 많아서 더위에 대비해야 해요. 특히 런던, 베를린 같은 북부도시도 여름엔 찜통이 되기도 해요!",
            likeCount: 15,
            isLiked: false,
          },
          {
            commentId: 286,
            parentId: 156,
            nickname: "백팩커",
            profileUrl: "https://picsum.photos/id/1043/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-12T11:30:00Z",
            content:
              "네, 유럽은 에어컨 문화가 아직 없는 곳이 많죠. 특히 민박이나 게스트하우스는 더 그렇고요. 저는 작년 여름 이탈리아 갔을 때 40도까지 올라가서 고생했어요. 추가 팁으로, 더울 때는 현지인들처럼 낮 시간(13~16시)에는 실내에서 쉬고 아침 일찍, 저녁에 관광하는 게 좋아요. 그리고 물, 젤라또, 차가운 음료는 필수입니다! 😊",
            likeCount: 18,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 157,
        parentId: undefined,
        nickname: currentUser.nickname,
        profileUrl: currentUser.profileUrl,
        userType: currentUser.userType,
        createdAt: "2023-06-12T12:00:00Z",
        content:
          "와 한 달 여행 정말 부럽습니다! 저도 올해 2주 정도 유럽 여행 계획 중인데 예산이 고민이네요. 혹시 한 달 총 경비가 얼마 정도 들었는지, 그리고 경비 절약 팁이 있으실까요? 식비가 가장 걱정되는데 현지에서 어떻게 식사하셨나요?",
        likeCount: 23,
        isLiked: false,
        replyCount: 1,
        replies: [
          {
            commentId: 287,
            parentId: 157,
            nickname: "여행매니아",
            profileUrl: "https://picsum.photos/id/1040/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-12T12:15:00Z",
            content:
              "제 한 달 총 경비는 항공권 포함 약 500만원 정도 들었어요(중저가 여행). 숙소는 주로 호스텔 도미토리(4~8인실)에서 묵었고, 가끔 Airbnb도 이용했어요. 식비 절약 팁은 1) 아침은 숙소에서 간단히 해결(많은 호스텔이 아침 제공) 2) 점심은 슈퍼마켓에서 샌드위치/샐러드 사먹기 3) 저녁만 현지 식당에서 먹기 4) 물병 들고 다니기 5) 호스텔 주방 이용해서 직접 요리하기(다른 여행자들과 교류도 되고 일석이조). 그리고 박물관은 학생증 있으면 할인되니 챙겨가세요!",
            likeCount: 25,
            isLiked: true,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 158,
        parentId: undefined,
        nickname: "디지털노마드",
        profileUrl: "https://picsum.photos/id/1077/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-12T13:00:00Z",
        content:
          "좋은 정보 감사합니다! 저는 디지털 노마드로 유럽에서 4개월 정도 지냈는데, 장기 체류자 팁을 드리자면 1) 한 도시에 최소 1주일 이상 머물면 Airbnb 장기 할인 적용됨(월 단위면 30~40% 할인) 2) 공항/기차역에서 시내로 갈 때 택시보다 대중교통이 훨씬 저렴 3) 유럽 전자제품은 비싸니 한국에서 다 가져가기 4) 노트북으로 작업하실 분들은 카페 와이파이보다 유심 데이터가 훨씬 안정적 5) 동유럽(프라하, 부다페스트 등)은 서유럽보다 물가가 50% 이상 저렴해서 장기 체류에 좋아요 6) 비지니스 센터나 코워킹 스페이스는 예약 필수. 추가 질문 있으시면 편하게 물어보세요!",
        likeCount: 36,
        isLiked: true,
        replyCount: 6,
        replies: [
          {
            commentId: 288,
            parentId: 158,
            nickname: "여행매니아",
            profileUrl: "https://picsum.photos/id/1040/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-12T13:15:00Z",
            content:
              "디지털 노마드 생활 정말 부럽습니다! 장기 체류 팁 정말 유용하네요. 혹시 유럽에서 디지털 노마드로 일하실 때 비자는 어떻게 해결하셨나요? 솔직히 저도 나중에 한번 도전해보고 싶어서요.",
            likeCount: 13,
            isLiked: false,
          },
          {
            commentId: 289,
            parentId: 158,
            nickname: "디지털노마드",
            profileUrl: "https://picsum.photos/id/1077/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-12T13:30:00Z",
            content:
              "EU는 기본적으로 관광비자로 90일까지 체류 가능해서 그 안에서 생활했어요. 90일 넘게 체류하려면 워킹홀리데이나 디지털노마드 비자를 받아야 해요. 포르투갈, 에스토니아, 크로아티아가 디지털노마드 비자 조건이 좋은 편이에요. 참고로 디지털노마드 비자는 대부분 안정적인 해외 수입(월 2~3천 유로 이상)을 증명해야 받을 수 있어요.",
            likeCount: 19,
            isLiked: true,
          },
          {
            commentId: 290,
            parentId: 158,
            nickname: "노트북여행자",
            profileUrl: "https://picsum.photos/id/1025/50/50",
            userType: getRandomUserType(),
            createdAt: "2023-06-12T13:45:00Z",
            content:
              "저도 디지털노마드로 스페인에 3개월 있었는데요, 시차 관리가 중요한 것 같아요. 한국 회사랑 일하면 저녁~밤에 일해야 하니 관광은 주로 오전에 했어요. 그리고 숙소 고를 때 와이파이 리뷰 꼭 확인하세요! 모든 에어비앤비 와이파이가 좋은 건 아니거든요. speedtest 결과 물어보는 것도 좋은 방법이에요.",
            likeCount: 14,
            isLiked: false,
          },
        ] as Reply[] | undefined,
      },
      {
        commentId: 159,
        parentId: undefined,
        nickname: "유럽전문가이드",
        profileUrl: "https://picsum.photos/id/1039/50/50",
        userType: getRandomUserType(),
        createdAt: "2023-06-12T14:00:00Z",
        content:
          "유럽 여행 전문 가이드입니다. 모두 좋은 정보 공유해주셨네요! 제가 추가로 알려드리고 싶은 팁은 1) '이것만은 꼭 봐야 한다'는 압박감에서 벗어나기(다 볼 수 없음) 2) 인스타그램 핫플보다 현지인 추천 장소 가보기 3) 소매치기는 정말 많으니 RF차단 가방/허리색 사용 4) 유럽 화장실은 유료(1~2유로)가 많으니 동전 챙기기 5) 팁은 의무가 아니지만, 서비스 좋으면 주는 것이 에티켓 6) 패키지여행보다는 한 도시에서 며칠씩 머물며 현지 분위기 느끼는 것 추천 7) City Pass는 주요 관광지 3곳 이상 방문 계획이면 경제적. 모두 즐거운 여행 되세요!",
        likeCount: 45,
        isLiked: false,
        replyCount: 0,
        replies: [] as Reply[] | undefined,
      },
    ],
  },
];

// 인기 게시글 목 데이터
export const mockPopularPosts = [
  {
    postId: 5,
    title: "요즘 넷플릭스에서 꼭 봐야할 작품 공유해요",
    createdAt: "2025-04-02T12:10:22Z",
    likeCount: 95,
    commentCount: 4,
  },
  {
    postId: 9,
    title: "2025년 상반기 베스트 책 추천",
    createdAt: "2025-04-01T13:12:45Z",
    likeCount: 91,
    commentCount: 4,
  },
  {
    postId: 3,
    title: "제주도 여행 필수 코스 공유합니다",
    createdAt: "2025-04-03T12:10:22Z",
    likeCount: 89,
    commentCount: 4,
  },
];
// --- 대댓글 더보기용 전체 대댓글 데이터 ---
export const mockAllReplies: { [key: number]: Reply[] } = {
  // key: 부모 댓글의 commentId
  // value: 해당 부모 댓글에 달린 모든 대댓글 Reply 객체 배열
  101: [
    // commentId: 101 댓글의 모든 대댓글 (총 5개)
    {
      commentId: 201,
      parentId: 101,
      nickname: "등산마스터",
      profileUrl: "https://picsum.photos/id/1027/50/50",
      userType: getRandomUserType(),
      createdAt: getRandomDate(3, 4), // 3~4일 전 (댓글보다 나중)
      content:
        "북한산 둘레길 중에서도 1-3구간이 제일 무난하고 좋아요. 초보자에게 딱이죠. 지하철로도 접근성이 좋아서 차가 없으신 분들도 쉽게 다녀오실 수 있습니다.",
      likeCount: 15,
      isLiked: false,
    },
    {
      commentId: 202,
      parentId: 101,
      nickname: currentUser.nickname,
      profileUrl: currentUser.profileUrl,
      userType: currentUser.userType,
      createdAt: getRandomDate(2, 3), // 2~3일 전
      content:
        "북한산 둘레길 정보 감사합니다! 혹시 소요 시간은 대략 어느 정도인가요? 오전에 가서 점심 먹고 오후에 내려올 생각인데 시간 계획을 어떻게 짜야 할지 고민이에요.",
      likeCount: 7,
      isLiked: true,
    },
    {
      commentId: 203,
      parentId: 101,
      nickname: "트레킹러버",
      profileUrl: "https://picsum.photos/id/1035/50/50",
      userType: getRandomUserType(),
      createdAt: getRandomDate(1, 2), // 1~2일 전
      content:
        "관악산도 좋지만 저는 청계산도 추천드려요! 대중교통으로 접근하기 쉽고 난이도도 적당해서 초보자분들에게 인기가 많아요. 특히 맨발공원 코스는 숲이 우거져서 여름에도 시원합니다.",
      likeCount: 12,
      isLiked: false,
    },
    // --- 아래는 '더보기'로 로드될 대댓글들 ---
    {
      commentId: 204,
      parentId: 101,
      nickname: "산악인김산",
      profileUrl: "https://picsum.photos/id/1040/50/50",
      userType: getRandomUserType(),
      createdAt: getRandomDate(1, 2), // 1~2일 전
      content:
        "북한산 둘레길은 구간별로 2-3시간 정도 소요됩니다. 1-3구간을 하루에 다 돌아도 충분히 가능해요. 중간에 식당도 몇 군데 있어서 점심 먹기도 좋습니다. 날씨 좋은 날 가시면 정말 좋을 거예요!",
      likeCount: 9,
      isLiked: false,
    },
    {
      commentId: 205,
      parentId: 101,
      nickname: "주말산행",
      profileUrl: "https://picsum.photos/id/1043/50/50",
      userType: getRandomUserType(),
      createdAt: getRandomDate(1, 1), // 1일 전
      content:
        "도봉산도 서울 근교에서 초보자가 도전하기 좋아요. 특히 도봉산역에서 출발하는 코스는 어렵지 않고 경치도 좋답니다. 다만 주말에는 사람이 많으니 평일에 가시는 걸 추천합니다.",
      likeCount: 11,
      isLiked: false,
    },
  ],
  108: [
    // 제주도 여행 글의 첫 번째 댓글 대댓글들 (총 5개)
    {
      commentId: 209,
      parentId: 108,
      nickname: "여행가이드",
      profileUrl: "https://picsum.photos/id/1011/50/50",
      userType: getRandomUserType(),
      createdAt: "2025-04-03T12:10:22Z",
      content:
        "우도에서는 전기자전거 타고 돌았어요! 비용은 2시간에 2만원 정도였고, 섬 전체를 돌기에 충분했습니다. 특히 우도봉 근처의 경치가 정말 좋으니 꼭 들러보세요!",
      likeCount: 15,
      isLiked: true,
    },
    {
      commentId: 210,
      parentId: 108,
      nickname: currentUser.nickname,
      profileUrl: currentUser.profileUrl,
      userType: currentUser.userType,
      createdAt: "2025-04-03T12:10:22Z",
      content:
        "저도 작년에 갔었는데 전기자전거 강추합니다! 우도땅콩아이스크림도 꼭 드셔보세요. 정말 맛있어요~",
      likeCount: 12,
      isLiked: false,
    },
    {
      commentId: 211,
      parentId: 108,
      nickname: "맛집탐험가",
      profileUrl: "https://picsum.photos/id/1074/50/50",
      userType: getRandomUserType(),
      createdAt: "2025-04-03T12:10:22Z",
      content:
        "우도는 전기자전거가 최고예요! 서두르지 않고 풍경 구경하면서 천천히 돌아볼 수 있어요. 참고로 배 탈 때 멀미약 챙기세요. 당일 바다 상태에 따라 배가 많이 흔들릴 수 있어요.",
      likeCount: 8,
      isLiked: false,
    },
    // --- 아래는 '더보기'로 로드될 대댓글들 ---
    {
      commentId: 309,
      parentId: 108,
      nickname: "사진여행가",
      profileUrl: "https://picsum.photos/id/1080/50/50",
      userType: getRandomUserType(),
      createdAt: "2025-04-04T12:10:22Z",
      content:
        "우도에서 꼭 가볼만한 곳은 서빈백사와 검멀레 해변이에요! 하얀모래해변과 까만모래해변을 모두 볼 수 있어서 색다른 경험이 됩니다. 사진 스팟으로도 최고예요!",
      likeCount: 7,
      isLiked: false,
    },
    {
      commentId: 310,
      parentId: 108,
      nickname: "제주마니아",
      profileUrl: "https://picsum.photos/id/1081/50/50",
      userType: getRandomUserType(),
      createdAt: "2025-04-04T12:10:22Z",
      content:
        "전기자전거 대여할 때 신분증 필요하니 꼭 챙겨가세요! 그리고 우도 내에서는 통신이 잘 안 되는 곳도 있으니 오프라인 지도나 길 안내 앱을 미리 다운받아가는 것도 좋아요.",
      likeCount: 5,
      isLiked: false,
    },
  ],
  // 다른 부모 댓글의 대댓글 데이터도 추가해야 함
  // ... existing code ...
};

// 댓글 ID로 해당 댓글/대댓글 찾기 함수
export const findReplyById = (commentId: number): Reply | undefined => {
  // 1. mockAllReplies에서 먼저 찾기 (전체 대댓글 목록)
  for (const [parentId, replies] of Object.entries(mockAllReplies)) {
    const foundReply = replies.find((reply) => reply.commentId === commentId);
    if (foundReply) return foundReply;
  }

  // 2. mockPosts의 모든 댓글과 대댓글에서 찾기
  for (const post of mockPosts) {
    // 댓글 확인
    const foundComment = post.comments.find(
      (comment) => comment.commentId === commentId
    );
    if (foundComment) {
      // 댓글 자체를 Reply 타입으로 변환하여 반환 (필요한 속성만)
      return {
        commentId: foundComment.commentId,
        parentId: foundComment.parentId || 0,
        nickname: foundComment.nickname,
        profileUrl: foundComment.profileUrl,
        userType: foundComment.userType,
        createdAt: foundComment.createdAt,
        content: foundComment.content,
        likeCount: foundComment.likeCount,
        isLiked: foundComment.isLiked,
      };
    }

    // 각 댓글의 대댓글들 확인
    for (const comment of post.comments) {
      if (comment.replies && comment.replies.length > 0) {
        const foundReply = comment.replies.find(
          (reply) => reply.commentId === commentId
        );
        if (foundReply) return foundReply;
      }
    }
  }

  return undefined; // 찾지 못한 경우
};
