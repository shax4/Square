import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import { cardData } from '../../components/DebateCard/card-data';
import colors from '../../../assets/colors';

type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;

export default function OpinionListScreen() {
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId } = route.params;

    const cardItem = cardData[debateId];
    console.log(debateId)
    console.log(cardItem.topic)
    return (

        <View style={styles.container}>
            {/* 토론 주제 표시 */}
            <View style={styles.topicView}>
                <Text style={styles.topicViewText}>{cardItem.topic}</Text>
            </View>

            {/* 좌 우 의견 태그 */}
            <View style={styles.optionView}>
                <Text style={styles.optionText}>{cardItem.leftOption}</Text>
                <Text style={styles.optionText}>{cardItem.rightOption}</Text>
            </View>

            {/* 의견 텍스트 버블: 토글에 따라 보여주는 텍스트 버블 타입이 달라짐 */}
            <View style={styles.opinionView}>

            </View>

            {/* AI 요약 및 전체 의견 텍스트 토글 */}
            <View style={styles.opinionTypeToggleView}>
                <TouchableOpacity>
                    <Text>AI 요약</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>전체 의견</Text>
                </TouchableOpacity>
            </View>

            {/* 좌 우 투표 버튼 */}
            <View>

            </View>

            {/* 참여중 인원 출력력 */}
            <View>
                <Text>지금까지 n명 참여중</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topicView: {
        height: 100,
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: 20,
        flexWrap: 'wrap',
    },
    topicViewText: {
        fontSize: 30,
        fontWeight: 600,
    },
    optionView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
    optionText: {
        width: '30%',
        height: 40,
        lineHeight: 40,
        backgroundColor: colors.hashtag,
        fontSize: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    opinionView: {
        flex: 5,
        backgroundColor: colors.black,
    },
    opinionTypeToggleView: {
        flex: 2,
    }
});