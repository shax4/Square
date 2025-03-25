import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OpinionListScreen() {
    return (
        <View style={styles.container}>
            <Text>This Is OpinionList Screen.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});