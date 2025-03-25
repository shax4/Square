import { View, Text, StyleSheet, FlatList } from "react-native";
import PostCard from "./PostCard"

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
                  <Text style={styles.placeholderText}>댓글 내용이 여기에 표시됩니다.</Text>
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
                  <Text style={styles.placeholderText}>내가 한 투표 내용이 여기에 표시됩니다.</Text>
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
                  <Text style={styles.placeholderText}>투표 스크랩 내용이 여기에 표시됩니다.</Text>
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