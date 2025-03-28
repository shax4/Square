import { OpinionsResponse } from './OpinionsResponse.types';
const opinionDetailTestData: OpinionsResponse = {
    opinionId: 1,
    nickname: "초코파이",
    profileUrl: "https://example.com/profile1.jpg",
    userType: "PNTB",
    createdAt: "2024-02-25T09:15:22Z",
    content: "안녕하세요",
    likeCount: 5,
    commentCount: 8,
    isLiked: true,
    comments: [
        {
            commentId: 3,
            nickname: "반짝이는코알라",
            profileUrl: "https://example.com/profile1.jpg",
            userType: "PNTB",
            createdAt: "2024-03-09T18:45:00Z",
            likeCount: 3,
            content: "안녕하세요",
            isLiked: true
        },
        {
            commentId: 5,
            nickname: "쿵쾅대는코알라",
            profileUrl: "https://example.com/profile1.jpg",
            userType: "PNTB",
            createdAt: "2024-03-09T18:45:00Z",
            likeCount: 5,
            content: "안녕하세요",
            isLiked: false
        }
    ]
};

export default opinionDetailTestData;
