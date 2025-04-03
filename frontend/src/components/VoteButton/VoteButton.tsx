import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './VoteButton.styles';
import {  updateVoteState } from '../../pages/DebateCardsScreen/Components/Debate.types';
import VoteConfirmModal from '../../pages/DebateCardsScreen/Components/VoteConfirmModal';
import { DebateResultModal } from '../../pages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import { useAuthStore } from '../../shared/stores';

import { resultData } from '../../pages/OpinionListScreen/Components/debate-result-test-data';
import { useDebateStore } from '../../shared/stores/debates';
import { voteDebate } from './api/VoteButtonApi';
import { useAuth } from '../../shared/hooks';
import { UserInfo } from '../../shared/types/user';

type VoteButtonProps = {
    debateId: number;
    showVoteResultModal?: boolean;
};

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";

const VoteButton = ({ debateId, showVoteResultModal, }: VoteButtonProps): JSX.Element => {
    // zustand
    const { debates, updateDebate } = useDebateStore();
    const debate = useDebateStore((state) =>
        state.debates.find((d) => d.debateId === debateId)
    );
    if (!debate) return <Text>Wrong debateId</Text>;
    const {user, setUser, loggedIn, logOut} = useAuth();

    // OpinionList에서 showVoteResultModal 여부를 보내 렌더링과 동시에 모달을 띄울지 여부 결정
    useEffect(() => {
        if (showVoteResultModal) {
            openDebateResultModal();
        }
    }, [showVoteResultModal]);

    // 투표 및 투표 확인 모달 관련
    const [voteConfirmModalVisible, setVoteConfirmModalVisible] = useState(false);
    const [selectedSide, setSelectedSide] = useState<boolean | null>(debate.isLeft);

    // 투표 통계 데이터
    const [debateResultData, setDebateResultData] = useState(resultData);
    // 투표 통계 모달
    const [debateResultModalVisible, setDebateResultModalVisible] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    // 투표 버튼 클릭 시
    const handleVote = (voteLeft: boolean) => {

        // 투표를 하지 않은 상태일 때: 투표 확인 모달을 띄운 후 투표 통계로 이동
        if (debate.isLeft == null) {
            setSelectedSide(voteLeft);
            setVoteConfirmModalVisible(true);
        }
        // 투표를 한 상태일 때: 투표 통계 모달 띄우기
        else {
            console.log(debate.debateId + " " + (voteLeft ? " 왼쪽" : " 오른쪽"));
            openDebateResultModal();
        }
    }

    // 투표 모달 취소
    const handleVoteCancel = () => {
        console.log("투표 취소");
        setVoteConfirmModalVisible(false);
    };

    // 투표 모달을 통한 투표 확정
    const handleVoteConfirm = () => {
        if (selectedSide !== null) {
            voteConfirm(debate.debateId, selectedSide);
        }
        setVoteConfirmModalVisible(false);
    };

    // 투표 모달 확인 클릭 시 동작하는 메서드
    const voteConfirm = async (
        debateId: number,
        isLeft: boolean,
    ) => {
        // API 투표 요청
        try{
            const response = await voteDebate(debateId, isLeft);
            // left right count 및 투표결과 zustand에 반영
            const updatedDebate = {
                ...debate,
                isLeft,
                leftCount: response.leftCount,
                rightCount: response.rightCount,
            };
    
            // zustand 투표 데이터 업데이트
            updateDebate(debateId, updateVoteState(updatedDebate));
    
            // 모달을 띄울 페이지로 이동해야하는지, 현재 페이지에서 모달을 띄울 수 있는지 판단
            const currentRoute = navigation.getState().routes[navigation.getState().index];
    
            // 모달 컴포넌트가 있는 페이지에서 투표 버튼을 눌렀다면 모달 띄우기
            if (currentRoute.name === 'OpinionListScreen') {
                openDebateResultModal();
            }
            // 모달 컴포넌트가 없는 페이지에서 투표 버튼을 눌렀다면 페이지 이동
            else {
                navigation.navigate('OpinionListScreen', {
                    debateId,
                    showVoteResultModal: true,
                });
            }
        } catch (error) {
            if ( user == null) {
                console.debug("로그인 필요");
                return(
                    <Text>로그인 창으로 이동 처리 필요</Text>
                )
            }
        }
        
    };

    const voted = debate.isLeft !== null;
    const widthLeft = voted ? Math.max(30, Math.min(debate.leftPercent, 70)) - 5 : 45;
    const widthRight = voted ? 100 - widthLeft - 10 : 45;

    // 투표 통계 모달 닫기
    const closeDebateResultModal = () => {
        setDebateResultModalVisible(false);
    }
    // 투표 통계 모달 열기
    const openDebateResultModal = () => {
        setDebateResultModalVisible(true);
    }

    return (
        <View style={styles.Container}>
            <TouchableOpacity
                style={[
                    styles.VoteButtonBase,
                    voted
                        ? debate.isLeft
                            ? styles.VoteSelectedLeft
                            : styles.VoteNotSelectedLeft
                        : styles.VoteNotSelectedLeft,
                    { width: `${widthLeft}%` },
                ]}
                onPress={() => handleVote(true)}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{leftOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{debate.leftOption}</Text>
                    {voted && (
                        <Text style={styles.VoteSubText}>{debate.leftPercent}% ({debate.leftCount}명)</Text>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.VoteButtonBase,
                    voted
                        ? !debate.isLeft
                            ? styles.VoteSelectedRight
                            : styles.VoteNotSelectedRight
                        : styles.VoteNotSelectedRight,
                    { width: `${widthRight}%` },
                ]}
                onPress={() => handleVote(false)}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{rightOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{debate.rightOption}</Text>
                    {voted && (
                        <Text style={styles.VoteSubText}>{debate.rightPercent}% ({debate.rightCount}명)</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* 투표 확인 모달 */}
            <VoteConfirmModal
                visible={voteConfirmModalVisible}
                debateId={debate.debateId}
                isLeft={selectedSide!} // 투표를 통해 selectedSice가 null 이 아닐때만 실행됨
                onCancel={handleVoteCancel}
                onConfirm={handleVoteConfirm}
            />

            {/* 투표 통계 모달 */}
            <DebateResultModal
                data={debateResultData}
                leftOption={debate.leftOption}
                rightOption={debate.rightOption}
                visible={debateResultModalVisible}
                onClose={() => closeDebateResultModal()}
                onPressMoreOpinion={() => { }}
            />
        </View>
    );
};

export default VoteButton;
