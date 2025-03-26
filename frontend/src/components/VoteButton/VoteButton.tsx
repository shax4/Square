import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './VoteButton.styles';
import { AfterVoteButtonViewProps, BeforeVoteButtonViewProps } from './VoteButton.types';

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";

// 투표 완료
export const AfterVoteButtonView = ({ debate, onSelectLeft, onSelectRight }: AfterVoteButtonViewProps): JSX.Element => {
    const {
        leftOption,
        rightOption,
        leftPercent,
        rightPercent,
        leftCount,
        rightCount,
        isLeft,
    } = debate;

    const widthLeft = Math.max(30, Math.min(leftPercent, 70)) - 10;
    const widthRight = 100 - widthLeft - 10;

    return (
        <View style={styles.Container}>
            <TouchableOpacity
                style={[
                    styles.VoteButtonBase,
                    isLeft ? styles.VoteSelectedLeft : styles.VoteNotSelectedLeft,
                    { width: `${widthLeft}%` },
                ]}
                onPress={onSelectLeft}
            >

                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{leftOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{leftOption}</Text>
                    <Text style={styles.VoteSubText}>{leftPercent}% ({leftCount}명)</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.VoteButtonBase,
                    !isLeft ? styles.VoteSelectedRight : styles.VoteNotSelectedRight,
                    { width: `${widthRight}%` },
                ]}
                onPress={onSelectRight}
            >

                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{rightOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{rightOption}</Text>
                    <Text style={styles.VoteSubText}>{rightPercent}% ({rightCount}명)</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// 투표 전
export const BeforeVoteButtonView = ({ debate, onSelectLeft, onSelectRight }: BeforeVoteButtonViewProps): JSX.Element => {
    const { leftOption, rightOption } = debate;

    return (
        <View style={styles.Container}>
            <TouchableOpacity
                style={[
                    styles.VoteButtonBase, styles.VoteNotSelectedLeft]}
                onPress={onSelectLeft}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{leftOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{leftOption}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.VoteButtonBase, styles.VoteNotSelectedRight]}
                onPress={onSelectRight}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{rightOptionEmoji}</Text>
                    <Text style={styles.VoteMainText}>{rightOption}</Text>
                </View>

            </TouchableOpacity>
        </View>
    );
};
