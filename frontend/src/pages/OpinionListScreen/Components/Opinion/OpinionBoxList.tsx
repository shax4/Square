import React from "react";
import { FlatList, StyleSheet } from "react-native";
import OpinionBox from "./OpinionBox";
import { Opinion } from "./Opinion.types";

interface Props {
    data: Opinion[];
    onEndReached?: () => void;
}

const OpinionBoxList = ({ data, onEndReached }: Props) => {
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.opinionId.toString()}
            renderItem={({ item }) => <OpinionBox opinion={item} />}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
        />
    );
};

export default OpinionBoxList;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
