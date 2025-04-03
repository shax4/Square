import { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import {mockComments} from "./mocks"
import CommentCard from "./CommentCard"
import { CommentResponse, Comment } from "../Type/mypageComment";
import { getMypageComments } from "../Api/commentAPI";

const CommentList = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchComments = async (cursorId: number | null) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : CommentResponse = await getMypageComments(cursorId, 10);

            setComments((prev) => [...prev, ...data.comments])
            setNextCursorId(data.nextCursorId || null);
        }catch(error){
            console.error("마이페이지 댓글 조회 실패 : ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        setComments([])
        setNextCursorId(null)
        fetchComments(null)
    }, [])

    const loadMore = useCallback(() => {
        if(nextCursorId && !loading){
            fetchComments(nextCursorId);
        }
    }, [nextCursorId, loading])

    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item.commentId.toString()}
            renderItem={({ item }) => (
            <CommentCard
                title={item.title}
                content={item.content}
                likeCount={item.likeCount}
                isLiked={item.isLiked}
                onPress={() => console.log(`Comment card pressed: ${item.commentId}`)}
                onLikeToggle={(isLiked) => console.log(`Like toggled to ${isLiked} for comment ${item.commentId}`)}
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

export default CommentList;