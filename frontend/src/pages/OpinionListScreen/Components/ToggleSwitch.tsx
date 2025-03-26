import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../../../assets/colors';


interface Props {
    isSummary: boolean;
    setIsSummary: (value: boolean) => void;
}

export default function ToggleSwitch({ isSummary, setIsSummary }: Props) {

    return (
        <View style={styles.opinionTypeToggleView}>
            <View style={styles.toggleWrapper}>
                <TouchableOpacity
                    style={[styles.toggleOption, isSummary && styles.activeOption]}
                    onPress={() => setIsSummary(true)}
                >
                    <Text style={isSummary ? styles.activeText : styles.inactiveText}>AI 요약</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleOption, !isSummary && styles.activeOption]}
                    onPress={() => setIsSummary(false)}
                >
                    <Text style={!isSummary ? styles.activeText : styles.inactiveText}>전체 의견</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    opinionTypeToggleView: {
        alignItems: 'center',
    },
    toggleWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.disabledBg,
        borderRadius: 10,
        overflow: 'hidden',
    },
    toggleOption: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    activeOption: {
        backgroundColor: colors.disabledText,
    },
    activeText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    inactiveText: {
        color: colors.hashtag,
    },
});
