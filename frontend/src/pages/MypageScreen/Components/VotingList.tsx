import { StyleSheet, FlatList } from "react-native";
import {mockVotes} from "./mocks"
import VotingCard from "./VotingCard";

const VotingList = () => {
    return (
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
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
});

export default VotingList;