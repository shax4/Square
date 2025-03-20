import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import { CardProps } from './DebateCard.types';
import { styles } from './DebateCard.styles';
import { Icons } from '../../../assets/icons/Icons';

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";

const DebateCard = ({
    debateId,
    category,
    topic,
    leftOption,
    rightOption,
    isScraped,
    hasVoted,
    leftCount,
    rightCount,
    leftPercent,
    rightPercent,
    totalVoteCount
}: CardProps): JSX.Element => {
    return (
        <View style={styles.CardContainer}>
            {/* 상단 패딩 */}
            <View style={styles.CardMarginTop} />

            <View style={styles.Card}>
                {/* Header */}
                <View style={styles.CardHeader}>
                    <Text style={styles.CardHeaderText}>Number {debateId}</Text>
                    <TouchableOpacity>
                        {isScraped ? <Icons.bookmarkUndo on /> : <Icons.bookmark />}
                    </TouchableOpacity>
                </View>

                {/* Hashtag */}
                <View style={styles.CardHashtag}>
                    <Text>{category}</Text>
                </View>

                {/* Topic */}
                <View style={styles.CardTopic}>
                    <Text style={styles.CardTopicText}>{topic}</Text>
                </View>

                {/* Vote Buttons: 투표 여부(hasVoted에 따라 다르게 렌더링*/}
                {hasVoted ?
                    // 투표 했을 때: percent 비율에 따라 버튼 너비 분할
                    <View style={styles.CardVote}>
                        <TouchableOpacity style={styles.CardVoteProsButton}>
                            <Text style={styles.CardVoteIcon}>{leftOptionEmoji}</Text>
                            <Text style={styles.CardVoteText}>{leftOption}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.CardVoteConsButton}>
                            <Text style={styles.CardVoteIcon}>{rightOptionEmoji}</Text>
                            <Text style={styles.CardVoteText}>{rightOption}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    // 투표하지 않았을 때
                    <View style={styles.CardVote}>
                        <TouchableOpacity style={styles.CardVoteProsButton}>
                            <Text style={styles.CardVoteIcon}>{leftOptionEmoji}</Text>
                            <Text style={styles.CardVoteText}>{leftOption}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.CardVoteConsButton}>
                            <Text style={styles.CardVoteIcon}>{rightOptionEmoji}</Text>
                            <Text style={styles.CardVoteText}>{rightOption}</Text>
                        </TouchableOpacity>
                    </View>
                }

                {/* Footer */}
                <View style={styles.CardFooter}>
                    <Text style={styles.CardFooterText}>지금까지 {leftCount + rightCount}명 참여중</Text>
                </View>
            </View>

            {/* 하단 패딩 */}
            <View style={styles.CardMarginBottom} />
        </View>


    )
}

export default DebateCard;