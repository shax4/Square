import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import DebateCard from './DebateCard';
import { Debate } from './Debate.types';
import { styles } from './DebateCard.styles';
import { getAllDebates } from '../api/DebateApi';

const { width, height } = Dimensions.get('window');

export default function DebateCardList() {
    const [debates, setDebates] = useState<Debate[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 3;

    const fetchData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const response = await getAllDebates(nextCursorId, limit);
            const newData = response.debates;
            const nextId = response.nextCursorId;

            if (newData.length > 0) {
                setDebates((prev) => [...prev, ...newData]);
                setNextCursorId(nextId);
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
