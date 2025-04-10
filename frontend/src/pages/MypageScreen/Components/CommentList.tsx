import { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, ActivityIndicator, View } from "react-native";
import CommentCard from "./CommentCard"
import { CommentResponse, Comment } from "../Type/mypageComment";
import { getMypageComments } from "../Api/commentAPI";
import Text from '../../../components/Common/Text';


const CommentList = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const fetchComments = async (cursorId: number | null) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : CommentResponse = await getMypageComments(cursorId, 10);

            if (cursorId === null && data.comments.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

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

export default CommentList;