import { View, Text, StyleSheet, FlatList } from "react-native";
import PostCard from "./PostCard"
import CommentCard from "./CommentCard";
import VotingCard from "./VotingCard";

interface Props {
    activeTab: string;
    activePostSection: string;
    activeVoteSection: string;
}

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

const MypageContent = ({ activeTab, activePostSection, activeVoteSection}: Props) => {
    const renderContent = () => {
        if (activeTab === "게시글") {
          switch (activePostSection) {
            case "작성글":
              return (
                <View style={styles.contentContainer}>
                    <FlatList
                        data={mockPosts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <PostCard
                            profileUrl={item.profileUrl}
                            nickname={item.nickname}
                            userType={item.userType}
                            createdAt={item.createdAt}
                            title={item.title}
                            content={item.content}
                            likeCount={item.likeCount}
                            commentCount={item.commentCount}
                            isLiked={item.isLiked}
                            onLikePress={() => console.log(`Like pressed for post ${item.id}`)}
                            onCommentPress={() => console.log(`Comment pressed for post ${item.id}`)}
                            onCardPress={() => console.log(`Card pressed for post ${item.id}`)}
                        />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
              )
            case "댓글":
              return (
                <View style={styles.contentContainer}>
                  <FlatList
                    data={mockComments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                    <CommentCard
                        title={item.title}
                        content={item.content}
                        likeCount={item.likeCount}
                        isLiked={item.isLiked}
                        onPress={() => console.log(`Comment card pressed: ${item.id}`)}
                        onLikeToggle={(isLiked) => console.log(`Like toggled to ${isLiked} for comment ${item.id}`)}
                    />
                    )}
                    contentContainerStyle={styles.listContent}
                />
                </View>
              )
            case "스크랩":
              return (
                <View style={styles.contentContainer}>
                    <FlatList
                        data={mockPosts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <PostCard
                            profileUrl={item.profileUrl}
                            nickname={item.nickname}
                            userType={item.userType}
                            createdAt={item.createdAt}
                            title={item.title}
                            content={item.content}
                            likeCount={item.likeCount}
                            commentCount={item.commentCount}
                            isLiked={item.isLiked}
                            onLikePress={() => console.log(`Like pressed for post ${item.id}`)}
                            onCommentPress={() => console.log(`Comment pressed for post ${item.id}`)}
                            onCardPress={() => console.log(`Card pressed for post ${item.id}`)}
                        />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
              )
            case "좋아요":
              return (
                <View style={styles.contentContainer}>
                    <FlatList
                        data={mockPosts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <PostCard
                            profileUrl={item.profileUrl}
                            nickname={item.nickname}
                            userType={item.userType}
                            createdAt={item.createdAt}
                            title={item.title}
                            content={item.content}
                            likeCount={item.likeCount}
                            commentCount={item.commentCount}
                            isLiked={item.isLiked}
                            onLikePress={() => console.log(`Like pressed for post ${item.id}`)}
                            onCommentPress={() => console.log(`Comment pressed for post ${item.id}`)}
                            onCardPress={() => console.log(`Card pressed for post ${item.id}`)}
                        />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
              )
            default:
              return null
          }
        } else {
          switch (activeVoteSection) {
            case "내가 한 투표":
              return (
                <View style={styles.contentContainer}>
                    <FlatList
                        data={mockVotes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <VotingCard
                            topic={item.topic}
                            isLeft={item.isLeft}
                            leftCount={item.leftCount}
                            rightCount={item.rightCount}
                            leftPercent={item.leftPercent}
                            rightPercent={item.rightPercent}
                            isScraped={item.isScraped}
                            onScrapToggle={() => console.log(`Scrap toggled for vote ${item.id}`)}
                            onCardPress={() => console.log(`Vote card pressed: ${item.id}`)}
                        />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
              )
            case "의견":
              return (
                <View style={styles.contentContainer}>
                  <Text style={styles.placeholderText}>의견 내용</Text>
                </View>
              )
            case "스크랩":
              return (
                <View style={styles.contentContainer}>
                    <FlatList
                        data={mockVotes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <VotingCard
                            topic={item.topic}
                            isLeft={item.isLeft}
                            leftCount={item.leftCount}
                            rightCount={item.rightCount}
                            leftPercent={item.leftPercent}
                            rightPercent={item.rightPercent}
                            isScraped={item.isScraped}
                            onScrapToggle={() => console.log(`Scrap toggled for vote ${item.id}`)}
                            onCardPress={() => console.log(`Vote card pressed: ${item.id}`)}
                        />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
              )
            default:
              return null
          }
        }
    }

    return renderContent();
}

const styles = StyleSheet.create({
    contentContainer: { flex: 1, padding: 8, minHeight: 300 },
    placeholderText: { textAlign: "center", color: "#888888", marginTop: 40 },
    listContent: {
        padding: 16,
    },
});

export default MypageContent;