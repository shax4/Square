import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CardProps } from './DebateCard.types';
import { styles } from './DebateCard.styles';
import { Icons } from '../../../assets/icons/Icons';
import VoteConfirmModal from './VoteConfirmModal';

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";

const Stack = createNativeStackNavigator<StackParamList>();

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
}: CardProps): JSX.Element => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSide, setSelectedSide] = useState<boolean | null>(isLeft);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 투표 모달 취소
    const handleVoteCancel = () => {
        console.log("투표 취소");
        setModalVisible(false);
    };

    // 투표 모달 확인
    const handleVoteConfirm = () => {
        if (selectedSide !== null) {
            voteConfirm(debateId, selectedSide, navigation);
        }
        setModalVisible(false);
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
                        <TouchableOpacity>
                            {isScraped ? <Icons.bookmarkUndo on /> : <Icons.bookmark />}
                        </TouchableOpacity>
                    </View>

                    {/* Hashtag */}
                    <View style={styles.CardHashtag}>
                        <Text style={styles.CardHashtagText}># {category}</Text>
                    </View>

                    {/* Topic */}
                    <TouchableOpacity
                        style={styles.CardTopic}
                        onPress={() => navigation.navigate('OpinionListScreen', { debateId })}>
                        <Text style={styles.CardTopicText}>{topic}</Text>
                    </TouchableOpacity>

                    {/* Vote Buttons: 투표 여부(isLeft에 따라 다르게 렌더링*/}
                    {isLeft != null ? (
                        <VotedView
                            debateId={debateId}
                            leftOption={leftOption}
                            rightOption={rightOption}
                            leftPercent={leftPercent}
                            rightPercent={rightPercent}
                            leftCount={leftCount}
                            rightCount={rightCount}
                            isLeft={isLeft}
                        />
                    ) : (
                        <UnvotedView
                            debateId={debateId}
                            leftOption={leftOption}
                            rightOption={rightOption}
                            onSelectLeft={() => {
                                setSelectedSide(true);
                                setModalVisible(true);
                            }}
                            onSelectRight={() => {
                                setSelectedSide(false);
                                setModalVisible(true);
                            }}
                        />
                    )}

                    {/* Footer */}
                    <View style={styles.CardFooter}>
                        <Text style={styles.CardFooterText}>지금까지 {totalVoteCount}명 참여중</Text>
                    </View>
                </View>

                {/* 하단 패딩 */}
                <View style={styles.CardMarginBottom} />
            </View>

            {/* 투표 확인 모달 */}
            <VoteConfirmModal
                visible={modalVisible}
                onCancel={handleVoteCancel}
                onConfirm={handleVoteConfirm}
            />
        </>
    )

}

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
}: {
    debateId: number;
    leftOption: string;
    rightOption: string;
    leftPercent: number;
    rightPercent: number;
    leftCount: number;
    rightCount: number;
    isLeft: boolean
}): JSX.Element => {

    {/* 최소 30%, 최대 70%로 제한 */ }
    const widthLeft = Math.max(30, Math.min(leftPercent, 70)) - 10;
    const widthRight = 100 - widthLeft - 10;
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    return (
        <View style={styles.CardVote}>
            {/* 좌측 버튼 */}
            <TouchableOpacity
                style={[
                    isLeft ? styles.CardVoteButtonSelectedLeft : styles.CardVoteButtonNotSelectedLeft,
                    { width: `${widthLeft}%` }
                ]}
                /* OpinionListScreen 으로 이동 */
                onPress={() => navigation.navigate('OpinionListScreen', { debateId })}
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
                onPress={() => navigation.navigate('OpinionListScreen', { debateId })}
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

    <View style={styles.CardVote}>
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


// 투표 모달 확인 클릭 시 동작하는 메서드
const voteConfirm = (
    debateId: number,
    isLeft: boolean,
    navigation: NativeStackNavigationProp<StackParamList>
) => {
    console.log(`debateId=${debateId}, 선택=${isLeft ? '왼쪽' : '오른쪽'}`);
    // API 요청 메서드 추가 필요

    // 의견 상세 페이지로 이동
    navigation.navigate('OpinionListScreen', { debateId });
};

export default DebateCard;