// 현재 사용자 정보
export const currentUser = {
    id: 1,
    nickname: "반짝이는하마",
    profileUrl: "",
    userType: "PNTB"
  };
  
  // 게시글 목 데이터
  export const mockPosts = [
    // 사용자 본인이 작성한 글
    {
      postId: 1,
      nickname: currentUser.nickname,
      profileUrl: currentUser.profileUrl,
      userType: currentUser.userType,
      createdAt: "2025-03-25T12:34:56Z",
      title: "내가 작성한 게시글입니다",
      content: "게시판 테스트를 위한 글입니다. 목 데이터로 구현하였습니다.",
      likeCount: 15,
      commentCount: 3,
      isLiked: false,
      isScrapped: false,
      comments: [
        {
          commentId: 1,
          nickname: "반짝이는코알라",
          profileUrl: "",
          userType: "PNTB",
          createdAt: "2025-03-25T13:00:00Z",
          content: "첫 번째 댓글입니다",
          likeCount: 5,
          isLiked: true,
          replyCount: 2,
          replies: [
            {
              commentId: 1,
              parentId: 1,
              nickname: "즐거운팬더",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-25T13:15:00Z",
              content: "첫 번째 대댓글입니다",
              likeCount: 3,
              isLiked: false
            },
            {
              commentId: 2,
              parentId: 1,
              nickname: currentUser.nickname,
              profileUrl: currentUser.profileUrl,
              userType: currentUser.userType,
              createdAt: "2025-03-25T13:20:00Z",
              content: "내가 작성한 대댓글입니다",
              likeCount: 2,
              isLiked: true
            }
          ]
        },
        {
          commentId: 2,
          nickname: currentUser.nickname,
          profileUrl: currentUser.profileUrl,
          userType: currentUser.userType,
          createdAt: "2025-03-25T14:00:00Z",
          content: "내가 작성한 두 번째 댓글입니다",
          likeCount: 4,
          isLiked: false,
          replyCount: 1,
          replies: [
            {
              commentId: 3,
              parentId: 2,
              nickname: "똑똑한사자",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-25T14:15:00Z",
              content: "대댓글 테스트입니다",
              likeCount: 1,
              isLiked: false
            }
          ]
        },
        {
          commentId: 3,
          nickname: "행복한기린",
          profileUrl: "",
          userType: "PNTB",
          createdAt: "2025-03-25T15:00:00Z",
          content: "세 번째 댓글입니다",
          likeCount: 2,
          isLiked: false,
          replyCount: 0,
          replies: []
        }
      ]
    },
    
    // 다른 사용자가 작성한 글 1
    {
      postId: 2,
      nickname: "반짝이는코알라",
      profileUrl: "",
      userType: "PNTB",
      createdAt: "2025-03-24T10:34:56Z",
      title: "안녕하세요! 반가워요",
      content: "게시판에 글을 작성해봅니다. 모두 반갑습니다. 좋은 하루 되세요!",
      likeCount: 23,
      commentCount: 3,
      isLiked: true,
      isScrapped: true,
      comments: [
        {
          commentId: 4,
          nickname: currentUser.nickname,
          profileUrl: currentUser.profileUrl,
          userType: currentUser.userType,
          createdAt: "2025-03-24T11:00:00Z",
          content: "저도 반가워요! 좋은 글 감사합니다.",
          likeCount: 7,
          isLiked: false,
          replyCount: 2,
          replies: [
            {
              commentId: 4,
              parentId: 4,
              nickname: "반짝이는코알라",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-24T11:15:00Z",
              content: "댓글 남겨주셔서 감사합니다!",
              likeCount: 3,
              isLiked: true
            },
            {
              commentId: 5,
              parentId: 4,
              nickname: "즐거운팬더",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-24T11:30:00Z",
              content: "모두 좋은 하루 되세요~",
              likeCount: 2,
              isLiked: false
            }
          ]
        },
        {
          commentId: 5,
          nickname: "똑똑한사자",
          profileUrl: "",
          userType: "PNTB",
          createdAt: "2025-03-24T12:00:00Z",
          content: "글 잘 봤습니다!",
          likeCount: 3,
          isLiked: false,
          replyCount: 1,
          replies: [
            {
              commentId: 6,
              parentId: 5,
              nickname: "반짝이는코알라",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-24T12:15:00Z",
              content: "감사합니다 :)",
              likeCount: 1,
              isLiked: false
            }
          ]
        },
        {
          commentId: 6,
          nickname: "행복한기린",
          profileUrl: "",
          userType: "PNTB",
          createdAt: "2025-03-24T13:00:00Z",
          content: "좋은 글이네요!",
          likeCount: 4,
          isLiked: true,
          replyCount: 0,
          replies: []
        }
      ]
    },
    
    // 다른 사용자가 작성한 글 2
    {
      postId: 3,
      nickname: "즐거운팬더",
      profileUrl: "",
      userType: "PNTB",
      createdAt: "2025-03-23T09:34:56Z",
      title: "오늘의 날씨가 정말 좋네요",
      content: "오늘 날씨가 정말 좋습니다. 여러분 모두 나들이 어떠신가요? 좋은 시간 보내세요!",
      likeCount: 45,
      commentCount: 3,
      isLiked: false,
      isScrapped: false,
      comments: [
        {
          commentId: 7,
          nickname: "행복한기린",
          profileUrl: "",
          userType: "PNTB",
          createdAt: "2025-03-23T10:00:00Z",
          content: "정말 날씨가 좋네요! 저도 나들이 가려구요.",
          likeCount: 6,
          isLiked: false,
          replyCount: 2,
          replies: [
            {
              commentId: 7,
              parentId: 7,
              nickname: "즐거운팬더",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-23T10:15:00Z",
              content: "좋은 시간 보내세요~",
              likeCount: 2,
              isLiked: false
            },
            {
              commentId: 8,
              parentId: 7,
              nickname: currentUser.nickname,
              profileUrl: currentUser.profileUrl,
              userType: currentUser.userType,
              createdAt: "2025-03-23T10:30:00Z",
              content: "저도 같이 가고 싶네요!",
              likeCount: 3,
              isLiked: true
            }
          ]
        },
        {
          commentId: 8,
          nickname: "반짝이는코알라",
          profileUrl: "",
          userType: "PNTB",
          createdAt: "2025-03-23T11:00:00Z",
          content: "날씨 정보 감사합니다!",
          likeCount: 4,
          isLiked: false,
          replyCount: 1,
          replies: [
            {
              commentId: 9,
              parentId: 8,
              nickname: "즐거운팬더",
              profileUrl: "",
              userType: "PNTB",
              createdAt: "2025-03-23T11:15:00Z",
              content: "천만에요~",
              likeCount: 1,
              isLiked: false
            }
          ]
        },
        {
          commentId: 9,
          nickname: currentUser.nickname,
          profileUrl: currentUser.profileUrl,
          userType: currentUser.userType,
          createdAt: "2025-03-23T12:00:00Z",
          content: "좋은 정보 감사합니다!",
          likeCount: 5,
          isLiked: false,
          replyCount: 0,
          replies: []
        }
      ]
    }
  ];
  
  // 인기 게시글 목 데이터
  export const mockPopularPosts = [
    {
      postId: 3,
      title: "오늘의 날씨가 정말 좋네요",
      createdAt: "2025-03-23T09:34:56Z",
      likeCount: 45,
      commentCount: 3
    },
    {
      postId: 2,
      title: "안녕하세요! 반가워요",
      createdAt: "2025-03-24T10:34:56Z",
      likeCount: 23,
      commentCount: 3
    },
    {
      postId: 1,
      title: "내가 작성한 게시글입니다",
      createdAt: "2025-03-25T12:34:56Z",
      likeCount: 15,
      commentCount: 3
    }
  ];
  