
const mockPosts = [
    {
      id: "1",
      profileUrl: "https://example.com/profile.jpg",
      nickname: "반짝이는 코알라",
      userType: "PNTB",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      title: "제 이름은 반짝이는 코알라입니다",
      content: "안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요",
      likeCount: 1203,
      commentCount: 1,
      isLiked: true,
    },
    {
      id: "2",
      profileUrl: "https://example.com/profile2.jpg",
      nickname: "행복한 판다",
      userType: "ENTJ",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      title: "오늘의 날씨가 정말 좋네요",
      content: "오늘 날씨가 정말 좋아서 산책을 다녀왔습니다. 여러분도 밖에 나가보세요!",
      likeCount: 42,
      commentCount: 5,
      isLiked: false,
    },
    {
      id: "3",
      profileUrl: "https://example.com/profile3.jpg",
      nickname: "꿈꾸는 고래",
      userType: "ISFP",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      title: "새로운 취미를 시작했어요",
      content: "요즘 수채화 그리기를 시작했는데 정말 재미있네요. 처음에는 어려웠지만 점점 나아지고 있어요.",
      likeCount: 89,
      commentCount: 12,
      isLiked: true,
    },
  ]

  // Mock data for comments
const mockComments = [
    {
      id: "1",
      title: "게시글 제목입니다.. 한 줄 넘어갈 경우 ... 처리",
      content: "댓글입니다. 댓글 내용이 두 줄 이상 넘어가면 뒤에 ... 추가...",
      likeCount: 1203,
      isLiked: false,
    },
    {
      id: "2",
      title: "오늘 날씨가 정말 좋네요! 여러분은 어떠신가요?",
      content: "맞아요! 정말 좋은 날씨네요. 저도 오늘 산책 다녀왔어요. 다음에는 한강 공원에 가볼 생각입니다.",
      likeCount: 42,
      isLiked: true,
    },
    {
      id: "3",
      title: "새로운 영화 추천해주세요",
      content: '최근에 본 영화 중에 "인셉션"이 정말 좋았어요. 꼭 한번 보세요!',
      likeCount: 15,
      isLiked: false,
    },
    {
      id: "4",
      title: "맛집 추천 부탁드립니다",
      content: '강남역 근처에 "맛있는 식당"이라는 곳이 새로 생겼는데 분위기도 좋고 음식도 맛있어요.',
      likeCount: 78,
      isLiked: true,
    },
    {
        id: "5",
        title: "새로운 영화 추천해주세요",
        content: '최근에 본 영화 중에 "인셉션"이 정말 좋았어요. 꼭 한번 보세요!',
        likeCount: 15,
        isLiked: false,
    },
    {
        id: "6",
        title: "맛집 추천 부탁드립니다",
        content: '강남역 근처에 "맛있는 식당"이라는 곳이 새로 생겼는데 분위기도 좋고 음식도 맛있어요.',
        likeCount: 78,
        isLiked: true,
    },
  ]


  // Mock data for votes
const mockVotes = [
    {
      id: "1",
      topic: "외모가 사회생활에 주는 영향이 있을까?",
      isLeft: false,
      leftCount: 49,
      rightCount: 50,
      leftPercent: 49,
      rightPercent: 50,
      isScraped: true,
    },
    {
      id: "2",
      topic: "인공지능이 인간의 일자리를 대체할까요?",
      isLeft: true,
      leftCount: 75,
      rightCount: 25,
      leftPercent: 75,
      rightPercent: 25,
      isScraped: false,
    },
    {
      id: "3",
      topic: "재택근무가 사무실 근무보다 효율적일까요?",
      isLeft: true,
      leftCount: 62,
      rightCount: 38,
      leftPercent: 62,
      rightPercent: 38,
      isScraped: false,
    },
    {
      id: "4",
      topic: "대학 교육은 미래에도 필수적일까요?",
      isLeft: false,
      leftCount: 45,
      rightCount: 55,
      leftPercent: 45,
      rightPercent: 55,
      isScraped: true,
    },
  ]

  // Mock data for opinions
const mockOpinions = [
    {
      id: "1",
      topic: "투표 주제 글 입니다.. 일정 글자 수를 넘기면..",
      content: "투표에 달린 의견글입니다. 두 줄이 넘어갈 경우, 이런 식으로 ...",
      likeCount: 1203,
      isLiked: true,
    },
    {
      id: "2",
      topic: "인공지능이 인간의 일자리를 대체할까요?",
      content:
        "저는 인공지능이 일부 직업을 대체할 수는 있지만, 새로운 직업을 창출할 것이라고 생각합니다. 기술 발전은 항상 그래왔습니다.",
      likeCount: 87,
      isLiked: false,
    },
    {
      id: "3",
      topic: "재택근무가 사무실 근무보다 효율적일까요?",
      content: "개인적으로는 재택근무가 집중력을 높이고 출퇴근 시간을 절약할 수 있어서 더 효율적이라고 생각합니다.",
      likeCount: 45,
      isLiked: true,
    },
    {
      id: "4",
      topic: "대학 교육은 미래에도 필수적일까요?",
      content:
        "대학 교육보다는 실무 경험과 전문 기술 교육이 더 중요해질 것 같습니다. 온라인 교육 플랫폼의 발전으로 대학의 역할이 줄어들 수 있습니다.",
      likeCount: 32,
      isLiked: false,
    },
  ]

export {mockPosts, mockComments, mockVotes, mockOpinions};