import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './VoteButton.styles';

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";
// 투표 완료 상태 컴포넌트
const VotedView = ({
    debateId,
    leftOption,
    rightOption,
    leftPercent,
    rightPercent,
    leftCount,
    rightCount,
    isLeft,
    onSelectLeft,
    onSelectRight,
}: {
    debateId: number;
    leftOption: string;
    rightOption: string;
    leftPercent: number;
    rightPercent: number;
    leftCount: number;
    rightCount: number;
    isLeft: boolean;
    onSelectLeft: () => void;
    onSelectRight: () => void;
}): JSX.Element => {

    {/* 최소 30%, 최대 70%로 제한 */ }
    const widthLeft = Math.max(30, Math.min(leftPercent, 70)) - 10;
    const widthRight = 100 - widthLeft - 10;

    return (
        <View style={styles.Container}>
            {/* 좌측 버튼 */}
            <TouchableOpacity
                style={[
                    isLeft ? styles.CardVoteButtonSelectedLeft : styles.CardVoteButtonNotSelectedLeft,
                    { width: `${widthLeft}%` }
                ]}
                /* OpinionListScreen 으로 이동 */
                onPress={onSelectLeft}
            >
                <Text style={styles.CardVoteIcon}>{leftOptionEmoji}</Text>
                <Text style={styles.CardVoteText}>{leftOption}</Text>
                <Text style={styles.CardVoteText}>{leftPercent}% ({leftCount}명)</Text>
            </TouchableOpacity>

            {/* 우측 버튼 */}
            <TouchableOpacity
                style={[
                    !isLeft ? styles.CardVoteButtonSelectedRight : styles.CardVoteButtonNotSelectedRight,
                    { width: `${widthRight}%` }
                ]}
                /* OpinionListScreen 으로 이동 */
                onPress={onSelectRight}
            >
                <Text style={styles.CardVoteIcon}>{rightOptionEmoji}</Text>
                <Text style={styles.CardVoteText}>{rightOption}</Text>
                <Text style={styles.CardVoteText}>{rightPercent}% ({rightCount}명)</Text>
            </TouchableOpacity>
        </View>
    );
};

// 투표 전 상태 컴포넌트
const UnvotedView = ({
    debateId,
    leftOption,
    rightOption,
    onSelectLeft,
    onSelectRight
}: {
    debateId: number;
    leftOption: string;
    rightOption: string;
    onSelectLeft: () => void;
    onSelectRight: () => void;
}): JSX.Element => (

    <View style={styles.Container}>
        {/* 좌측 버튼 */}
        <TouchableOpacity
            style={styles.CardVoteButtonBeforeVoteLeft}
            onPress={onSelectLeft}
        >
            <Text style={styles.CardVoteIcon}>{leftOptionEmoji}</Text>
            <Text style={styles.CardVoteText}>{leftOption}</Text>
        </TouchableOpacity>

        {/* 우측 버튼 */}
        <TouchableOpacity
            style={styles.CardVoteButtonBeforeVoteRight}
            onPress={onSelectRight}
        >
            <Text style={styles.CardVoteIcon}>{rightOptionEmoji}</Text>
            <Text style={styles.CardVoteText}>{rightOption}</Text>
        </TouchableOpacity>
    </View>
);

export default { VotedView, UnvotedView };