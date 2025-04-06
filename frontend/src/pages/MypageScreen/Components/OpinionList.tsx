import { StyleSheet, FlatList, ActivityIndicator, View, Text } from "react-native";
import { useState, useEffect, useCallback } from "react";
import OpinionCard from "./OpinionCard";
import { Opinion, OpinionResponse } from "../Type/mypageOpinion";
import { getMypageOpinions } from "../Api/opinionAPI";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {StackParamList} from '../../../shared/page-stack/MyPageStack'
const OpinionList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [nextCursorId, setNextCursorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const fetchOpinions = async (cursorId : number | null) => {
        if(loading) return;

        setLoading(true);
        try{
            const data : OpinionResponse = await getMypageOpinions(cursorId, 10);

            if(cursorId === null && opinions.length === 0){
                setIsEmpty(true);
            }else{
                setIsEmpty(false);
            }

            setOpinions((prev) => [...prev, ...data.opinions]);
            setNextCursorId(data.nextCursorId || null)
        }catch(error){
            console.error("마이페이지 의견 조회 실패 : ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        setOpinions([]);
        setNextCursorId(null);
        fetchOpinions(null);
    }, [])

    const loadMore = useCallback(() => {
        if(nextCursorId && !loading){
            fetchOpinions(nextCursorId);
        }
    }, [nextCursorId, loading])

    const onClickOpinionCard = (debateId : number, opinionId : number) => {
        navigation.navigate('OpinionDetailScreen', { debateId, opinionId });
    }

    return (
        <FlatList
            data={opinions}
            keyExtractor={(item) => item.opinionId.toString()}
            renderItem={({ item }) => (
            <OpinionCard
                topic={item.topic}
                content={item.content}
                likeCount={item.likeCount}
                isLiked={item.isLiked}
                onLikeToggle={(isLiked) => console.log(`Like toggled to ${isLiked} for opinion ${item.opinionId}`)}
                onCardPress={() => onClickOpinionCard(1, item.opinionId)} // WIP
            />
            )}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading? <ActivityIndicator size="small"/> : null}
            ListEmptyComponent={
                isEmpty ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>의견이 없습니다.</Text>
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

export default OpinionList