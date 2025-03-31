import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './VoteButton.styles';
import { Debate } from '../../pages/DebateCardsScreen/DebateCard/Debate.types';
import VoteConfirmModal from '../../pages/DebateCardsScreen/DebateCard/VoteConfirmModal';
import { DebateResultModal } from '../../pages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
type VoteButtonProps = {
    debate: Debate
};

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";

const VoteButton = ({ debate }: VoteButtonProps): JSX.Element => {
    const {
        leftOption,
        rightOption,
        leftPercent,
        rightPercent,
        leftCount,
        rightCount,
        isLeft,
    } = debate;

    // 투표 및 투표 확인 모달 관련
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSide, setSelectedSide] = useState<boolean | null>(debate.isLeft);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 투표 버튼 클릭 시
    const handleVote = (voteLeft: boolean) => {

        // 투표를 하지 않은 상태일 때: 투표 확인 모달을 띄운 후 투표 통계로 이동
        if (debate.isLeft == null) {
            setSelectedSide(voteLeft);
            setModalVisible(true);
        }
        // 투표를 한한 상태일 때: 투표 통계가 떠있는 의견 리스트 페이지로
        else {
            console.log(debate.debateId + " " + (voteLeft ? " 왼쪽" : " 오른쪽"));
            navigation.navigate('OpinionListScreen', { debateId: debate.debateId, isDebateModalInitialVisible: true });
        }
    }

    // 투표 모달 취소
    const handleVoteCancel = () => {
        console.log("투표 취소");
        setModalVisible(false);
    };

    // 투표 모달을 통한 투표 확정
    const handleVoteConfirm = () => {
        if (selectedSide !== null) {
            voteConfirm(debate.debateId, selectedSide);
        }
        setModalVisible(false);
    };

    // 투표 모달 확인 클릭 시 동작하는 메서드
    const voteConfirm = (
        debateId: number,
        isLeft: boolean,
    ) => {
        console.log(`debateId=${debateId}, 선택=${isLeft ? '왼쪽' : '오른쪽'}`);
        // API 요청 메서드 추가 필요


        // 통계 모달 띄우는 기능 추가 필요
        const currentRoute = navigation.getState().routes[navigation.getState().index];

        // 투표 통계 모달을 볼 수 있는 의견 리스트 페이지에서 투표한 경우: 모달 띄우기만, 아니라면 페이지 이동
        if (currentRoute.name === 'OpinionListScreen') {

            navigation.setParams({ isDebateModalInitialVisible: true });
        } else {
            navigation.navigate('OpinionListScreen', { debateId: debate.debateId, isDebateModalInitialVisible: true });
        }
    };

    const voted = isLeft !== null;
    const widthLeft = voted ? Math.max(30, Math.min(leftPercent, 70)) - 10 : 45;
    const widthRight = voted ? 100 - widthLeft - 10 : 45;

    return (
        <View style={styles.Container}>
            <TouchableOpacity
                style={[
                    styles.VoteButtonBase,
                    voted
                        ? isLeft
                            ? styles.VoteSelectedLeft
                            : styles.VoteNotSelectedLeft
                        : styles.VoteNotSelectedLeft,
                    { width: `${widthLeft}%` },
                ]}
                onPress={() => handleVote(true)}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{leftOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{leftOption}</Text>
                    {voted && (
                        <Text style={styles.VoteSubText}>{leftPercent}% ({leftCount}명)</Text>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.VoteButtonBase,
                    voted
                        ? !isLeft
                            ? styles.VoteSelectedRight
                            : styles.VoteNotSelectedRight
                        : styles.VoteNotSelectedRight,
                    { width: `${widthRight}%` },
                ]}
                onPress={() => handleVote(false)}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{rightOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{rightOption}</Text>
                    {voted && (
                        <Text style={styles.VoteSubText}>{rightPercent}% ({rightCount}명)</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* 투표 확인 모달 */}
            <VoteConfirmModal
                visible={modalVisible}
                debateId={debate.debateId}
                isLeft={selectedSide!} // 투표를 통해 selectedSice가 null 이 아닐때만 실행됨
                onCancel={handleVoteCancel}
                onConfirm={handleVoteConfirm}
            />
        </View>
    );
};

export default VoteButton;
