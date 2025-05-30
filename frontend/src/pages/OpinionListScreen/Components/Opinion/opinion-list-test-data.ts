import { OpinionsResponse } from '../../api/OpinionsResponse.types';
import { debateData } from '../../../DebateCardsScreen/Components';

export const opinionResponse1: OpinionsResponse = {
    debate: debateData[0],
    opinions: [
        {
            opinionId: 101,
            content: "개는 사람과 교감이 잘 돼서 외롭지 않아요!",
            likeCount: 12,
            commentCount: 2,
            isLeft: true,
            createdAt: "2025-03-25T10:00:00Z",
            nickname: "충성스런댕댕이",
            profileUrl: "https://example.com/profile-dog1.jpg",
            userType: "PNTB",
            isLiked: true,
        },
        {
            opinionId: 102,
            content: "고양이는 혼자 잘 지내서 바쁜 사람에게 좋아요.",
            likeCount: 8,
            commentCount: 1,
            isLeft: false,
            createdAt: "2024-03-26T14:12:00Z",
            nickname: "도도한고먐미",
            profileUrl: "https://example.com/profile-cat1.jpg",
            userType: "PNTB",
            isLiked: false,
        },
        {
            opinionId: 103,
            content: "개랑 산책하면 운동도 되고 기분 전환도 됩니다!",
            likeCount: 5,
            commentCount: 0,
            isLeft: true,
            createdAt: "2024-03-25T08:30:00Z",
            nickname: "산책하는보더콜리",
            profileUrl: "https://example.com/profile-dog2.jpg",
            userType: "PNTB",
            isLiked: false,
        },
        {
            opinionId: 104,
            content: "고양이는 공간을 많이 차지하지 않아서 좋아요.",
            likeCount: 7,
            commentCount: 3,
            isLeft: false,
            createdAt: "2024-03-25T07:20:00Z",
            nickname: "작은고양이연구소",
            profileUrl: "https://example.com/profile-cat2.jpg",
            userType: "PNTB",
            isLiked: true,
        },
    ],
    nextLeftCursorId: 110,
    nextLeftCursorLikes: null,
    nextLeftCursorComments: null,
    nextRightCursorId: 111,
    nextRightCursorLikes: null,
    nextRightCursorComments: null,
};
