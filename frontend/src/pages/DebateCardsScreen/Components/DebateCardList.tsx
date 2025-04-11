import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, ActivityIndicator, FlatList, Dimensions, RefreshControl, TouchableOpacity, Text } from 'react-native';
import DebateCard from './DebateCard';
import { styles } from './DebateCard.styles';
import { getAllDebates } from '../api/DebateApi';
import { useDebateStore } from '../../../shared/stores/debates';
import { useAuthStore } from '../../../shared/stores/auth';

const { width, height } = Dimensions.get('window');

const DebateCardList = forwardRef((props, ref) => {
    const { loggedIn } = useAuthStore();
    const { debates, addDebates, clearDebates } = useDebateStore();
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const limit = 3;
    const flatListRef = useRef<FlatList>(null);

    const fetchData = useCallback(async (refresh = false) => {
        if ((loading && !refresh) || (!hasMore && !refresh)) return;

        setLoading(true);

        try {
            // 리프레시 시에는 첫 페이지부터 다시 로드
            const cursorToUse = refresh ? null : nextCursorId;

            const response = await getAllDebates(cursorToUse, limit);
            const newData = response.debates;
            const nextId = response.nextCursorId;

            if (newData.length > 0) {
                // 리프레시 시에는 목록을 초기화하고 새 데이터만 표시
                if (refresh) {
                    clearDebates();
                    await new Promise((r) => setTimeout(r, 10));

                    addDebates(newData);
                    setHasMore(true);
                } else {
                    addDebates(newData);
                }

                // 더이상 줄 데이터가 없다 알리면 페이징 막기 
                if (nextId == null) {
                    setHasMore(false);
                } else {
                    setNextCursorId(nextId);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.debug("논쟁 데이터 로드 실패:", error);
            setHasMore(false);
        }

        setLoading(false);
        setRefreshing(false);
    }, [nextCursorId, loading, hasMore, clearDebates, addDebates]);

    useEffect(() => {
        if (!loggedIn) {
            clearDebates();
        }
        fetchData();
    }, [loggedIn]);

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchData();
        }
    };

    const onRefresh = useCallback(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        setRefreshing(true);
        setNextCursorId(null);
        fetchData(true);
    }, [fetchData]);

    // 외부에서 onRefresh를 호출할 수 있도록 노출
    useImperativeHandle(ref, () => ({
        onRefresh,
    }));

    return (
        <View style={styles.CardListView}>
            <FlatList
                ref={flatListRef}
                data={debates}
                renderItem={({ item }) => <DebateCard {...item} />}
                keyExtractor={(item) => item.debateId.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && !refreshing ? <ActivityIndicator size="large" /> : null}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2196F3']}
                        tintColor={'#2196F3'}
                    />
                }
                pagingEnabled={true}
                snapToAlignment="center"
                snapToInterval={height}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
});
export default DebateCardList;
