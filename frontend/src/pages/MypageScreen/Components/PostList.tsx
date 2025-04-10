import { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, ActivityIndicator, View} from "react-native";
import PostCard from "./PostCard"
import { getMypagePosts } from "../Api/postAPI";
import { Post, PostResponse } from "../Type/mypagePost";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {StackParamList} from '../../../shared/page-stack/MyPageStack'
import Text from '../../../components/Common/Text';

interface Props {
    type : "작성글" | "스크랩" | "좋아요";
}

const API_URLS = {
    작성글: "my",
    스크랩: "my-scraps",
    좋아요: "my-likes",
  };

const PostList = ({type} : Props) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const [posts, setPosts] = useState<Post[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const fetchPosts = async (cursorId: number | null) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : PostResponse = await getMypagePosts(API_URLS[type], cursorId, 10)

            if (cursorId === null && data.posts.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

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

    const onClickPost = (postId : number) => {
        navigation.navigate("BoardDetail", { boardId: postId})
    }

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
                onCardPress={() => onClickPost(item.postId)}
            />
            )}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading? <ActivityIndicator size="small"/> : null}
            ListEmptyComponent={
                isEmpty ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>아직 자료가 없습니다.</Text>
                    </View>
                ) : null
            }
        />
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
    },
});

export default PostList;