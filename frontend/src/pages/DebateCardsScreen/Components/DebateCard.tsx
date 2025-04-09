import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebateStackParamList } from '../../../shared/page-stack/DebatePageStack';

import { Debate } from './Debate.types';
import { styles } from './DebateCard.styles';
import VoteButton from '../../../components/VoteButton/VoteButton'
import ScrapButton from '../../../components/ScrapButton/ScrapButton';
import { useDebateStore } from '../../../shared/stores/debates';
import { scrapDebate, scrapDebateUndo } from '../api/DebateApi';
import Text from '../../../components/Common/Text';

interface DebateCardProps {
    debateId: number;
}

const DebateCard = ({ debateId }: DebateCardProps): JSX.Element => {

    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();

    // zustand
    const { debates, updateDebate } = useDebateStore();
    const debate = debates.find((d) => d.debateId === debateId);
    if (!debate) return <Text>Wrong debateId</Text>;

    const navigateToOpinionListPage = () => {
        navigation.navigate('OpinionListScreen', { debateId });
    }

    const handlePressScrap = async () => {
        const newScrap = !debate.isScraped;
        updateDebate(debateId, { isScraped: newScrap });

        // 스크랩 API 요청
        newScrap ? scrapDebate(debateId) : scrapDebateUndo(debateId);
    };

    return (
        <>
            <View style={styles.CardContainer}>
                {/* 상단 패딩 */}
                <View style={styles.CardMarginTop} />

                <View style={styles.Card}>
                    {/* Header */}
                    <View style={styles.CardHeader}>
                        <Text weight="medium" style={styles.CardHeaderText}>논쟁 {debateId}</Text>
                        <ScrapButton
                            isScraped={debate.isScraped}
                            onPressScrap={() => { handlePressScrap() }}
                        />
                    </View>

                    {/* Hashtag */}
                    <View style={styles.CardHashtag}>
                        <Text style={styles.CardHashtagText}># {debate.category}</Text>
                    </View>

                    {/* Topic */}
                    <TouchableOpacity
                        style={styles.CardTopic}
                        onPress={() => navigateToOpinionListPage()}>
                        <Text style={styles.CardTopicText}>{debate.topic}</Text>
                    </TouchableOpacity>

                    {/* Vote Buttons: 투표 여부(isLeft에 따라 다르게 렌더링*/}
                    <View style={styles.CardVote}>
                        <VoteButton
                            debateId={debateId}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.CardFooter}>
                        <Text style={styles.CardFooterText}>지금까지 {debate.totalVoteCount}명 참여중</Text>
                    </View>
                </View>

                {/* 하단 패딩 */}
                <View style={styles.CardMarginBottom} />
            </View>
        </>
    )
}

export default DebateCard;