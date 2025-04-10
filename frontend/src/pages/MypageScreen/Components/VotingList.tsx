import { StyleSheet, FlatList, ActivityIndicator, View, Text } from "react-native";
import VotingCard from "./VotingCard";
import { Voting, VotingResponse, VotingScrapResponse } from "../Type/mypageVoting";
import { useState, useEffect, useCallback } from "react";
import { getMypageVotings, getMypageVotingScraps } from "../Api/votingAPI";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { getDebateById } from "../../DebateCardsScreen/api/DebateApi";

import { StackParamList } from '../../../shared/page-stack/MyPageStack'
import { useDebateStore } from "../../../shared/stores/debates";
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    type: string;
}

const VotingList = ({ type }: Props) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const [votings, setVotings] = useState<Voting[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    // Zustand debates
    const { debates, addDebates } = useDebateStore();
    const fetchVotings = async (cursorId: number | null) => {
        if (loading) return;

        setLoading(true);
        try {
            if (type === 'my-votes') {
                const data: VotingResponse = await getMypageVotings(cursorId, 10);
                addDebatesToZustand(data.debates);
                const processedVotings = (data.debates ?? []).map((vote) => {
                    const totalVotes = vote.leftCount + vote.rightCount;
                    const leftPercent = totalVotes > 0 ? Math.round((vote.leftCount / totalVotes) * 100) : 0;
                    const rightPercent = totalVotes > 0 ? Math.round((vote.rightCount / totalVotes) * 100) : 0;
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
            } else {
                const data: VotingScrapResponse = await getMypageVotingScraps(cursorId, 10);
                //console.log(data)
                addDebatesToZustand(data.scraps);

                const processedVotings = (data.scraps ?? []).map((vote) => {
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
            }
        } catch (error) {
            console.error("마이페이지 투표 조회 실패 : ", error);
        } finally {
            setLoading(false);
        }
    }

    // 강제로 갱신
    useFocusEffect(
        useCallback(() => {
            setVotings([]);
            setNextCursorId(null);
            fetchVotings(null);
        }, [type])
    );

    const addDebatesToZustand = async (data: Voting[]) => {
        for (const debate of data) {
            const response = await getDebateById(Number(debate.debateId));
            addDebates(response.debates);
        }
    }

    const loadMore = useCallback(() => {
        if (nextCursorId && !loading) {
            fetchVotings(nextCursorId);
        }
    }, [nextCursorId, loading]);

    const onClickVotingCard = (debateId: number) => {
        console.log(`clicked ${debateId}`)
        navigation.navigate('OpinionListScreen', { debateId });
    }

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
                    onCardPress={() => onClickVotingCard(parseInt(item.debateId))}
                />
            )}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
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

export default VotingList;