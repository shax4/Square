import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, Dimensions, StyleSheet } from 'react-native';
import DebateCard from './DebateCard';
import { cardData } from './card-data';
import { DebateProps } from './DebateData.types';
import { styles } from './DebateCard.styles';


const { width, height } = Dimensions.get('window');

export default function DebateCardList() {
    const [debates, setDebates] = useState<DebateProps[]>([]);
    const [cursorId, setCursorId] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 3;

    // 데이터 페이징 요청해 가져오기
    const fetchData = useCallback(async () => {
        if (loading || !hasMore) {
            return;
        }

        setLoading(true);

        const startIndex = cursorId !== null ? cursorId : 0;
        const newData = cardData.slice(startIndex, startIndex + limit);
        if (newData.length > 0) {
            setDebates(prevData => [...prevData, ...newData]);
            setCursorId(startIndex + limit);
        } else {
            setHasMore(false);
        }

        setLoading(false);
    }, [cursorId, loading, hasMore]);

    useEffect(() => { fetchData(); }, []);

    // 화면에서 보는 카드가 마지막 카드일 때, 페이징 요청(onEndReached 이벤트 발생 시 실행)
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
                pagingEnabled={true} // 한 개씩 스크롤되도록 설정
                snapToAlignment="center" // 중앙 정렬
                snapToInterval={height} // 카드 하나의 높이에 맞춰 스크롤
                decelerationRate="fast" // 빠르게 스냅 스크롤
                showsVerticalScrollIndicator={false} // 스크롤바 숨김
            />
        </View>


    );
};