import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../../../assets/colors';
import { likeProposal } from '../Api/proposalListAPI';
import { LikeButton } from '../../../components';
import { useAdminMode } from '../../../shared/hooks/useAdminMode';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebateStackParamList } from '../../../shared/page-stack/DebatePageStack';
import { Proposal } from '../Type/proposalListType';
interface ProposalItemProps {
    item: Proposal;
}

const ProposalItem = ({
    item
}: ProposalItemProps): JSX.Element => {
    const { isAdminMode } = useAdminMode();
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();

    const ProposalItemContent = () => {
        return (
            <>
                <Text style={styles.Title}>{item.topic}</Text>

                <LikeButton
                    initialCount={item.likeCount}
                    initialLiked={item.isLiked}
                    isVertical={false}
                    onPress={() => { likeProposal(item.proposalId) }}
                />
            </>
        )
    }
    // 관리자 모드가 아닐 때
    if (!isAdminMode) {
        return (
            <View style={styles.ContentText}>
                <ProposalItemContent />
            </View>
        );
    }
    // 관리자 모드일 때
    else {
        return (
            <TouchableOpacity style={styles.ContentText}
                onPress={() => { navigation.navigate('ProposalEditScreen', { proposal: item }) }}
            >
                <ProposalItemContent />
            </TouchableOpacity>
        )
    }

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