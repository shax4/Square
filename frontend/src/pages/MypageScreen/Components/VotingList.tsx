import { StyleSheet, FlatList, ActivityIndicator, View, Text } from "react-native";
import {mockVotes} from "./mocks"
import VotingCard from "./VotingCard";
import { Voting, VotingResponse } from "../Type/mypageVoting";
import { useState, useEffect, useCallback } from "react";
import { getMypageVotings } from "../Api/votingAPI";

interface Props {
    type : string;
}

const VotingList = ({type} : Props) => {
    const [votings, setVotings] = useState<Voting[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const fetchVotings = async (cursorId : number | null) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : VotingResponse = await getMypageVotings(type, cursorId, 10);
            const processedVotings = (data.votings ?? []).map((vote) => {
                const totalVotes = vote.leftCount + vote.rightCount;
                const leftPercent = totalVotes > 0 ? (vote.leftCount / totalVotes) * 100 : 0;
                const rightPercent = totalVotes > 0 ? (vote.rightCount / totalVotes) * 100 : 0;

                return {
                    ...vote,
                    leftPercent,
                    rightPercent
                };
            });

            if (cursorId === null && processedVotings.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

            setVotings((prev) => [...prev, ...processedVotings]);
            setNextCursorId(data.nextCursorId || null)
        }catch(error){
            console.error("마이페이지 투표 조회 실패 : ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        setVotings([]);
        setNextCursorId(null)
        fetchVotings(null);
    }, [type]);

    const loadMore = useCallback(() => {
        if (nextCursorId && !loading) {
            fetchVotings(nextCursorId);
        }
    }, [nextCursorId, loading]);
    
    return (
        <FlatList
            data={votings}
            keyExtractor={(item) => item.debateId.toString()}
            renderItem={({ item }) => (
            <VotingCard
                topic={item.topic}
                isLeft={item.isLeft}
                leftCount={item.leftCount}
                rightCount={item.rightCount}
                leftPercent={item.leftPercent}
                rightPercent={item.rightPercent}
                isScraped={item.isScraped}
                onScrapToggle={() => console.log(`Scrap toggled for vote ${item.debateId}`)}
                onCardPress={() => console.log(`Vote card pressed: ${item.debateId}`)}
            />
            )}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading? <ActivityIndicator size="small"/> : null}
            ListEmptyComponent={
                isEmpty ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>투표가 없습니다.</Text>
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

export default VotingList;