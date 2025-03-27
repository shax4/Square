import { StyleSheet, FlatList } from "react-native";
import {mockPosts} from "./mocks"
import PostCard from "./PostCard"

const PostList = () => {
    return (
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
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
});

export default PostList;