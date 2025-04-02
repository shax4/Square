import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import DebateCard from './DebateCard';
import { Debate } from './Debate.types';
import { styles } from './DebateCard.styles';
import { getAllDebates } from '../api/DebateApi';
import { computeDebateListFields } from './Debate.types';
import { useDebateStore } from '../../../shared/stores/debates';

const { width, height } = Dimensions.get('window');

export default function DebateCardList() {
    const { debates, addDebates, clearDebates } = useDebateStore();
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 3;

    const fetchData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const response = await getAllDebates(nextCursorId, limit);
            const newData = computeDebateListFields(response.debates);
            const nextId = response.nextCursorId;

            if (newData.length > 0) {
                // 통계 정보 계산해 넣기
                const computedDebates = computeDebateListFields(newData);
                addDebates(computedDebates);

                // 더이상 줄 데이터가 없다 알리면 페이징 막기 
                if (nextId == null) {
                    setHasMore(false);
                    return;
                } else {
                    setNextCursorId(nextId);
                }

            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("페이징 실패:", error);
            setHasMore(false);
        }

        setLoading(false);
    }, [nextCursorId, loading, hasMore]);

    useEffect(() => {
        fetchData();
    }, []);

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchData();
        }
    };

    return (
        <View style={styles.CardListView}>
            <FlatList
                data={debates}
                renderItem={({ item }) => <DebateCard {...item} />}
                keyExtractor={(item) => item.debateId.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
                pagingEnabled={true}
                snapToAlignment="center"
                snapToInterval={height}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
