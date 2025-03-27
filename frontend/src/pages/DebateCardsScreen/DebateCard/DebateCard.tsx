import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../../shared/page-stack/DebatePageStack';

import { Debate } from './Debate.types';
import { styles } from './DebateCard.styles';
import { Icons } from '../../../../assets/icons/Icons';
import VoteConfirmModal from './VoteConfirmModal';
import { AfterVoteButtonView, BeforeVoteButtonView } from '../../../components/VoteButton/VoteButton'

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


    // 투표 및 투표 확인 모달 관련
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSide, setSelectedSide] = useState<boolean | null>(isLeft);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 투표 버튼 클릭 시
    const handleVote = (isLeft: boolean) => {
        setSelectedSide(isLeft);
        setModalVisible(true);
    }

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

    const navigateToOpinionListPage = () => {
        navigation.navigate('OpinionListScreen', { debateId });
    }

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
                    <View style={styles.CardVote}>
                        {isLeft != null ? (
                            <AfterVoteButtonView
                                debate={debate}
                                onSelectLeft={navigateToOpinionListPage}
                                onSelectRight={navigateToOpinionListPage}
                            />
                        ) : (
                            <BeforeVoteButtonView
                                debate={debate}
                                onSelectLeft={() => {
                                    handleVote(true);
                                }}
                                onSelectRight={() => {
                                    handleVote(false);
                                }}
                            />
                        )}
                    </View>

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
                debateId={debateId}
                isLeft={selectedSide!} // 투표를 통해 selectedSice가 null 이 아닐때만 실행됨
                onCancel={handleVoteCancel}
                onConfirm={handleVoteConfirm}
            />
        </>
    )

}

export default DebateCard;