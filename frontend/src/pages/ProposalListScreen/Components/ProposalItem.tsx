import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Proposal } from './ProposalProps';
import { Icons } from '../../../../assets/icons/Icons';
import colors from '../../../../assets/colors';
import { likeProposal } from '../Api/proposalListAPI';

interface ProposalItemProps {
    item: Proposal;
}

const ProposalItem = ({
    item
}: ProposalItemProps): JSX.Element => {
    const [isLiked, setIsLiked] = useState(item.isLiked); // 좋아요 여부
    const [likeCount, setLikeCount] = useState(item.likeCount); // 좋아요 수

    const handleLike = async (proposalId : number) => {
        try{
            likeProposal(proposalId)
            console.log("청원 좋아요 누르기 완료. proposalID : ", proposalId);

            // 상태 토글 및 좋아요 수 업데이트
            setIsLiked(prev => !prev);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        }catch(error){
            console.log("청원 좋아요 에러. ");
        }
    }

    return (
        <View style={styles.ContentText}>
            <Text style={styles.Title}>{item.topic}</Text>
            <TouchableOpacity
                style={styles.LikeButton}
                onPress={() => handleLike(item.proposalId)}
            >
                {/* 좋아요 상태에 따라 아이콘 색상 변경 */}
                {isLiked ? <Icons.heartFill color={'red'} /> : <Icons.heartBlank color={'black'}/>}
                
                <Text style={[styles.LikesText, isLiked && { color: 'red' }]}>
                    {likeCount}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    ContentText: {
        padding: 14,
        backgroundColor: colors.proposalBox,
        borderRadius: 8,
        marginBottom: 15,
    },
    Title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    LikeButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    LikesText: {
        color: colors.disabledText,
        marginLeft: 8,
    },
});

export default ProposalItem;