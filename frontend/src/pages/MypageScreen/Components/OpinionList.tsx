import { StyleSheet, FlatList } from "react-native";
import {mockOpinions} from "./mocks"
import PostCard from "./PostCard"
import OpinionCard from "./OpinionCard";

const OpinionList = () => {
    return (
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
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
});

export default OpinionList