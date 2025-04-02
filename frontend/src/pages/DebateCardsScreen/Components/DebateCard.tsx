import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../../shared/page-stack/DebatePageStack';

import { Debate } from './Debate.types';
import { styles } from './DebateCard.styles';
import { Icons } from '../../../../assets/icons/Icons';
import VoteButton from '../../../components/VoteButton/VoteButton'
import BookmarkButton from '../../../components/BookmarkButton/BookmarkButton';

const DebateCard = ({
    debateId,
    category,
    topic,
    leftOption,
    rightOption,
    isScraped,
    isLeft,
    leftCount,
    rightCount,
    leftPercent,
    rightPercent,
    totalVoteCount
}: Debate): JSX.Element => {

    const debate: Debate = {
        debateId,
        category,
        topic,
        leftOption,
        rightOption,
        isScraped,
        isLeft,
        leftCount,
        rightCount,
        leftPercent,
        rightPercent,
        totalVoteCount,
    };

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const navigateToOpinionListPage = () => {
        navigation.navigate('OpinionListScreen', { debateId, debate });
    }

    const [scrap, setScrap] = useState(debate.isScraped);

    const handlePressScrap = () => {
        console.log("DebateCard.tsx scrap Button Clicked")
        setScrap(prev => !prev);
    };

    return (
        <>
            <View style={styles.CardContainer}>
                {/* 상단 패딩 */}
                <View style={styles.CardMarginTop} />

                <View style={styles.Card}>
                    {/* Header */}
                    <View style={styles.CardHeader}>
                        <Text style={styles.CardHeaderText}>Number {debateId}</Text>
                        <BookmarkButton
                            isScraped={debate.isScraped}
                            onPressScrap={() => { handlePressScrap }}
                        />
                    </View>

                    {/* Hashtag */}
                    <View style={styles.CardHashtag}>
                        <Text style={styles.CardHashtagText}># {category}</Text>
                    </View>

                    {/* Topic */}
                    <TouchableOpacity
                        style={styles.CardTopic}
                        onPress={() => navigateToOpinionListPage()}>
                        <Text style={styles.CardTopicText}>{topic}</Text>
                    </TouchableOpacity>

                    {/* Vote Buttons: 투표 여부(isLeft에 따라 다르게 렌더링*/}
                    <View style={styles.CardVote}>
                        <VoteButton
                            debate={debate}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.CardFooter}>
                        <Text style={styles.CardFooterText}>지금까지 {totalVoteCount}명 참여중</Text>
                    </View>
                </View>

                {/* 하단 패딩 */}
                <View style={styles.CardMarginBottom} />
            </View>
        </>
    )
}

export default DebateCard;