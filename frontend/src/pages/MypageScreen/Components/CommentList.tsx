import { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList } from "react-native";
import {mockComments} from "./mocks"
import CommentCard from "./CommentCard"

const CommentList = () => {
    const [comments, setComments] = useState<Comment[]>([]);


    return (
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
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
});

export default CommentList;