import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Proposal } from './ProposalProps';
import { Icons } from '../../../../assets/icons/Icons';
import colors from '../../../../assets/colors';

interface ProposalItemProps {
    item: Proposal;
}

const ProposalItem = ({
    item
}: ProposalItemProps): JSX.Element => {

    return (
        <View
            style={styles.ContentText}
        >
            <Text style={styles.Title}>{item.topic}</Text>
            <TouchableOpacity
                style={styles.LikeButton}
                onPress={() => console.log(`청원 ID : ${item.proposalId}, 청원 좋아요 기능`)}>
                <Icons.heartBlank />
                <Text style={styles.LikesText}>{item.likeCount}</Text>
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