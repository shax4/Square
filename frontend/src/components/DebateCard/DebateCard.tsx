import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import { CardProps } from './DebateCard.types';
import { styles } from './DebateCard.styles';

const leftSideEmoji = "🙆‍♂️";
const rightSideEmoji = "🙅";

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
        <View>
            {/* Header */}
            <View>
                
            </View>

            {/* Hashtag */}
            <View>

            </View>

            {/* Topic */}
            <View>

            </View>

            {/* Vote Buttons */}
            <View>

            </View>

            {/* Footer */}
            <View>

            </View>


        </View>

    )
}

function setBookmarkIcon({isScraped} : {isScraped: boolean}) {
    return(
        {isScraped}
    )
}


export default DebateCard;