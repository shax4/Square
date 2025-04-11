import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './VoteButton.styles';

const leftOptionEmoji = "🙆‍♂️";
const rightOptionEmoji = "🙅";

export const VoteCreateButtonView = () => {

    return (
        <View style={styles.Container}>
            <View
                style={[
                    styles.VoteButtonBase, styles.VoteNotSelectedLeft]}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{leftOptionEmoji}</Text>
                </View>
            </View>

            <View
                style={[
                    styles.VoteButtonBase, styles.VoteNotSelectedRight]}
            >
                <View style={styles.VoteContents}>
                    <Text style={styles.VoteIcon}>{rightOptionEmoji}</Text>
                </View>

            </View>
        </View>
    );
};
