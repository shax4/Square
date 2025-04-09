import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

interface SettingToggleItemProps {
    label: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
}

const SettingToggleItem: React.FC<SettingToggleItemProps> = ({ label, value, onValueChange }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.label}>{label}</Text>
            <Switch value={value} onValueChange={onValueChange} />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#f9f9f9",
    },
    label: {
        fontSize: 16,
    },
});

export default SettingToggleItem;
