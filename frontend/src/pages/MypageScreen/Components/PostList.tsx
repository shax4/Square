import { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import {mockPosts} from "./mocks"
import PostCard from "./PostCard"
import { getMypagePosts } from "../Api/postAPI";
import { Post, PostResponse } from "../Type/mypagePost";

interface Props {
    type : "작성글" | "스크랩" | "좋아요";
}

const API_URLS = {
    작성글: "my",
    스크랩: "my-scraps",
    좋아요: "my-likes",
  };

const PostList = ({type} : Props) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPosts = async (cursorId: number | null) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : PostResponse = await getMypagePosts(API_URLS[type], cursorId, 10)

            setPosts((prev) => [...prev, ...data.posts])
            setNextCursorId(data.nextCursorId || null);
        }catch(error){
            console.error("마이페이지 게시글 조회 실패 : ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        setPosts([]);
        setNextCursorId(null)
        fetchPosts(null);
    }, [type]);

    const loadMore = useCallback(() => {
        if (nextCursorId && !loading) {
          fetchPosts(nextCursorId);
        }
      }, [nextCursorId, loading]);

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.postId.toString()}
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
                onLikePress={() => console.log(`Like pressed for post ${item.postId}`)}
                onCommentPress={() => console.log(`Comment pressed for post ${item.postId}`)}
                onCardPress={() => console.log(`Card pressed for post ${item.postId}`)}
            />
            )}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading? <ActivityIndicator size="small"/> : null}
        />
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
});

export default PostList;