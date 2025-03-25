import { View, Text, StyleSheet, FlatList } from "react-native";
import PostCard from "./PostCard"
import CommentCard from "./CommentCard";
import VotingCard from "./VotingCard";
import OpinionCard from "./OpinionCard";
import {mockPosts, mockComments, mockVotes, mockOpinions} from "./mocks"

interface Props {
    activeTab: string;
    activePostSection: string;
    activeVoteSection: string;
}

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
                    <FlatList
                        data={mockOpinions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <OpinionCard
                            topic={item.topic}
                            content={item.content}
                            likeCount={item.likeCount}
                            isLiked={item.isLiked}
                            onLikeToggle={(isLiked) => console.log(`Like toggled to ${isLiked} for opinion ${item.id}`)}
                            onCardPress={() => console.log(`Opinion card pressed: ${item.id}`)}
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